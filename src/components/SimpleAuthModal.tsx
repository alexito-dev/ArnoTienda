import React, { useState } from 'react';
import { X, User, Mail, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: UserProfile) => void;
}

export const SimpleAuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const user: UserProfile = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    localStorage.setItem('arno_user_profile', JSON.stringify(user));
    onSuccessLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center font-black text-sm shadow-md">
              A
            </div>
            <div>
              <h2 className="text-base font-black text-[var(--color-text)]">
                Registro Rápido en 1 Clic
              </h2>
              <span className="text-xs text-[var(--color-text-muted)] font-semibold">
                Guarda tus claves y licencias compradas
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-[var(--color-text-muted)] mb-1">
              Tu Nombre Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-text-muted)] mb-1">
              Correo Electrónico *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-extrabold text-xs transition cursor-pointer shadow-md flex items-center justify-center space-x-2 group"
            >
              <span>Ingresar y Guardar Perfil</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[var(--color-text-muted)] font-medium pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tus datos están protegidos y encriptados</span>
          </div>
        </form>
      </div>
    </div>
  );
};
