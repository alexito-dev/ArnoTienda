import React from 'react';
import { ShieldCheck, Zap, Crown, Star } from 'lucide-react';

export const G2AShieldBar: React.FC = () => {
  return (
    <div className="bg-[var(--color-sidebar)] border-b border-[var(--color-border)] py-2.5 px-4 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[var(--color-text-muted)] font-semibold">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#A7D792]" />
          <span className="text-[var(--color-text)] font-extrabold">ARNO PROTECT GUARANTEE:</span>
          <span>100% Cobertura o Reemplazo de Clave</span>
        </div>

        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-[#847CB8]" />
          <span>Entrega Digital Instantánea &lt;10s</span>
        </div>

        <div className="flex items-center space-x-1.5 text-[#FF66C4] font-extrabold">
          <Crown className="w-4 h-4" />
          <span>Arno Pass: Descuentos Exclusivos en Claves</span>
        </div>

        <div className="flex items-center space-x-1 text-amber-500 font-extrabold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-[var(--color-text)]">4.9 / 5.0</span>
          <span className="text-[var(--color-text-muted)] font-normal text-[11px]">(+15k reseñas en Trustpilot)</span>
        </div>
      </div>
    </div>
  );
};
