import React, { useState } from 'react';
import { X, ShieldCheck, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '../types/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const ClaimGuaranteeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [orderEmail, setOrderEmail] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitGuarantee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderEmail.trim()) return;

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-[var(--color-text)]">
                Garantía Protegida ArnoAI 100%
              </h2>
              <span className="text-xs text-[var(--color-text-muted)] font-semibold">
                Reemplazo automático de clave o asistencia técnica
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

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-black text-[var(--color-text)]">
              Solicitud de Garantía Registrada
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] max-w-xs mx-auto">
              Nuestro sistema automatizado verificará tu compra y te enviará la clave de reemplazo a tu correo en menos de 15 minutos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitGuarantee} className="space-y-4 text-xs font-semibold">
            {product && (
              <div className="p-3 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center space-x-3">
                <span className="font-extrabold text-[var(--color-text)] block truncate">
                  Producto: {product.name}
                </span>
              </div>
            )}

            <div>
              <label className="block text-[var(--color-text-muted)] mb-1">
                Correo Electrónico de la Compra *
              </label>
              <input
                type="email"
                required
                value={orderEmail}
                onChange={(e) => setOrderEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>

            <div>
              <label className="block text-[var(--color-text-muted)] mb-1">
                Detalle de la consulta o inconveniente
              </label>
              <textarea
                rows={3}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe brevemente lo que sucedió (ej. requiere nuevo código)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8] resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--color-text)] font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold transition cursor-pointer shadow-md flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Solicitar Reemplazo</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
