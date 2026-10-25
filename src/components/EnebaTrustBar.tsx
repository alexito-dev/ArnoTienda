import React from 'react';
import { Zap, ShieldCheck, MessageSquare, Star } from 'lucide-react';

export const EnebaTrustBar: React.FC = () => {
  return (
    <div className="bg-[var(--color-sidebar)] border-b border-[var(--color-border)] py-2.5 px-4 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[var(--color-text-muted)] font-semibold">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-[#847CB8]" />
          <span>Entrega Digital Instantánea &lt;10s</span>
        </div>

        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#A7D792]" />
          <span>Claves 100% Verificadas & Garantizadas</span>
        </div>

        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-[#FF66C4]" />
          <span>Soporte Técnico 24/7</span>
        </div>

        <div className="flex items-center space-x-1.5 text-amber-500 font-extrabold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-[var(--color-text)]">4.9 / 5.0</span>
          <span className="text-[var(--color-text-muted)] font-normal text-[11px]">(+15,000 reseñas)</span>
        </div>
      </div>
    </div>
  );
};
