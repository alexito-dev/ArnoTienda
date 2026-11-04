import React from 'react';
import { Product } from '../types/store';
import { PRODUCTS } from '../data/products';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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
  onBuyNow,
}) => {
  const featuredProduct = PRODUCTS.find((p) => p.id === 'gemini-ai-pro') || PRODUCTS[0];
  const currentPrice = billingCycle === 'yearly' ? featuredProduct.numericYearlyPrice : featuredProduct.numericPrice;
  const pricePEN = (currentPrice * 3.75).toFixed(2);

  return (
    <div className="mb-10 rounded-[36px] bg-white border border-[#E9E9F5] p-6 sm:p-10 shadow-sm overflow-hidden select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Headline & Details */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-[#847CB8] text-white tracking-wider shadow-sm">
              Destacado Oficial
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Entrega Inmediata 24/7</span>
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold text-[#FF66C4] bg-[#FF66C4]/10 border border-[#FF66C4]/30">
              -50% Descuento
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#1E1C21] tracking-tight leading-tight">
            {featuredProduct.name}
          </h1>

          <p className="text-sm text-[#726C82] leading-relaxed max-w-xl font-medium">
            {featuredProduct.description}
          </p>

          {/* Billing Cycle Toggle in Arno Colors */}
          <div className="pt-2 flex items-center space-x-3">
            <span className="text-xs font-bold text-[#726C82] uppercase tracking-wider">
              Ciclo:
            </span>
            <div className="bg-[#F5F5FB] border border-[#E9E9F5] p-1 rounded-full flex items-center space-x-1">
              <button
                onClick={() => onToggleBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#847CB8] text-white shadow-xs'
                    : 'text-[#726C82] hover:text-[#1E1C21]'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => onToggleBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#847CB8] text-white shadow-xs'
                    : 'text-[#726C82] hover:text-[#1E1C21]'
                }`}
              >
                <span>Anual</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#FF66C4] text-white">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Card in Clean White & Lila */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-xs rounded-[32px] bg-[#F5F5FB] border border-[#E9E9F5] p-4 shadow-md">
            {/* Inner Light Window */}
            <div className="relative aspect-[4/3] w-full rounded-[24px] bg-white flex items-center justify-center overflow-hidden p-6 shadow-xs border border-[#E9E9F5]/60">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1B73E8] via-[#847CB8] to-[#FF66C4] p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
                    <path
                      d="M24 4C24 15.0457 15.0457 24 4 24C15.0457 24 24 32.9543 24 44C24 32.9543 32.9543 24 44 24C32.9543 24 24 15.0457 24 4Z"
                      fill="#847CB8"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="px-2 pt-4 pb-1">
              <h3 className="text-lg font-bold text-[#1E1C21] tracking-tight truncate">
                {featuredProduct.name}
              </h3>
              <p className="text-xs text-[#726C82] font-medium mt-0.5">
                Google One • 18 Meses Oficiales
              </p>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-black text-[#1E1C21] tracking-tight">
                    S/ {pricePEN}
                  </div>
                  <div className="text-[11px] font-medium text-[#726C82] mt-0.5">
                    ${currentPrice.toFixed(2)} USD • Garantizado
                  </div>
                </div>

                <button
                  onClick={() => onBuyNow(featuredProduct)}
                  className="px-5 py-3 rounded-[18px] bg-[#847CB8] hover:bg-[#6F66A8] text-white font-bold text-xs flex items-center space-x-1.5 active:scale-95 transition-all shadow-md shadow-[#847CB8]/25 cursor-pointer"
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
