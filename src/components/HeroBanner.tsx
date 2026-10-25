import React from 'react';
import { Sparkles, Zap, ShieldCheck, Rocket, Percent, ArrowRight } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface Props {
  billingCycle: 'monthly' | 'yearly';
  onToggleBillingCycle: (cycle: 'monthly' | 'yearly') => void;
  onOpenAIWizard: () => void;
}

export const HeroBanner: React.FC<Props> = ({
  billingCycle,
  onToggleBillingCycle,
  onOpenAIWizard,
}) => {
  return (
    <div className="relative mb-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 text-[var(--color-text)] shadow-xs select-none">
      {/* Top Banner Promo Ticker */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[var(--color-border)]/50">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FF66C4]/15 text-[#FF66C4] border border-[#FF66C4]/30">
          <Percent className="w-3.5 h-3.5" />
          <span>OFERTA LIMITADA: 10% OFF con el código <strong className="underline">ARNO10</strong></span>
        </div>

        <button
          onClick={onOpenAIWizard}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#847CB8]/15 hover:bg-[#847CB8] text-[#847CB8] hover:text-white border border-[#847CB8]/30 transition flex items-center space-x-2 cursor-pointer group"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Asistente IA para elegir tu plan</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Main Hero Headline & Subtitle */}
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          La Plataforma Oficial de <span className="text-[#847CB8]">Inteligencia Artificial & Licencias ArnoAI</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
          Accede instantáneamente a modelos de última generación (Claude 4.6 Sonnet, GPT-4o, Gemini 2.0 y DeepSeek R1) con entrega automatizada en menos de 10 segundos.
        </p>
      </div>

      {/* Billing Cycle Toggle (Mensual vs Anual 20% OFF) */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-[var(--color-border)]/50">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Facturación:</span>
          <div className="bg-[var(--color-sidebar)] border border-[var(--color-border)] p-1 rounded-2xl flex items-center space-x-1">
            <button
              onClick={() => onToggleBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#847CB8] text-white shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => onToggleBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[#847CB8] text-white shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <span>Anual</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-white/20 text-white">
                20% Ahorro
              </span>
            </button>
          </div>
        </div>

        {/* Live Metrics Pills */}
        <div className="flex items-center space-x-4 text-[11px] text-[var(--color-text-muted)] font-semibold">
          <div className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-[#A7D792]" />
            <span>99.9% Uptime</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Rocket className="w-4 h-4 text-[#FF66C4]" />
            <span>+15,000 Devs</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#847CB8]" />
            <span>Entrega &lt;10s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
