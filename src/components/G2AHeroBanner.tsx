import React from 'react';
import { Product } from '../types/store';
import { PRODUCTS } from '../data/products';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  billingCycle: 'monthly' | 'yearly';
  onToggleBillingCycle: (cycle: 'monthly' | 'yearly') => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const G2AHeroBanner: React.FC<Props> = ({
  billingCycle,
  onToggleBillingCycle,
  onAddToCart,
  onBuyNow,
}) => {
  const featuredProduct = PRODUCTS.find((p) => p.id === 'gemini-ai-pro') || PRODUCTS[0];
  const currentPrice = billingCycle === 'yearly' ? featuredProduct.numericYearlyPrice : featuredProduct.numericPrice;
  const pricePEN = (currentPrice * 3.75).toFixed(2);

  return (
    <div className="mb-10 rounded-[36px] bg-[#1a1a1c] border border-white/5 p-6 sm:p-10 shadow-2xl shadow-black/40 overflow-hidden select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Headline & Details */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-white text-zinc-950 tracking-wider">
              Destacado Oficial
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              Entrega Inmediata 24/7
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {featuredProduct.name}
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl font-medium">
            {featuredProduct.description}
          </p>

          {/* Minimalist Billing Cycle Toggle */}
          <div className="pt-2 flex items-center space-x-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Ciclo:
            </span>
            <div className="bg-zinc-900/90 border border-zinc-800 p-1 rounded-full flex items-center space-x-1">
              <button
                onClick={() => onToggleBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => onToggleBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300">
                  Ahorro 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Card Styled Identical to Reference Image */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-xs rounded-[32px] bg-[#222225] border border-white/5 p-4 shadow-xl">
            {/* Inner Light Window */}
            <div className="relative aspect-[4/3] w-full rounded-[24px] bg-[#f0f1f3] flex items-center justify-center overflow-hidden p-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1B73E8] via-[#8E24AA] to-[#FF6D00] p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
                    <path
                      d="M24 4C24 15.0457 15.0457 24 4 24C15.0457 24 24 32.9543 24 44C24 32.9543 32.9543 24 44 24C32.9543 24 24 15.0457 24 4Z"
                      fill="#8E24AA"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="px-2 pt-4 pb-1">
              <h3 className="text-lg font-bold text-white tracking-tight truncate">
                {featuredProduct.name}
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">
                Google One • 18 Meses Oficiales
              </p>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-black text-white tracking-tight">
                    S/ {pricePEN}
                  </div>
                  <div className="text-[11px] font-medium text-zinc-500 mt-0.5">
                    ${currentPrice.toFixed(2)} USD • Garantizado
                  </div>
                </div>

                <button
                  onClick={() => onBuyNow(featuredProduct)}
                  className="px-5 py-3 rounded-[18px] bg-white text-zinc-950 font-bold text-xs flex items-center space-x-1.5 hover:bg-zinc-100 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <span>Ver Oferta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
