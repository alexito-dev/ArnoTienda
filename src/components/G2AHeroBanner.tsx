import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, ArrowRight, ShieldCheck, CheckCircle2, Crown, ShoppingBag, Clock } from 'lucide-react';
import { Product } from '../types/store';
import { PRODUCTS } from '../data/products';

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
  onQuickView,
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProduct = PRODUCTS.find((p) => p.id === 'arnoai-pro') || PRODUCTS[2];
  const displayPrice = billingCycle === 'yearly' ? featuredProduct.yearlyPriceDisplay : featuredProduct.priceDisplay;
  const originalPrice = billingCycle === 'yearly' ? featuredProduct.originalYearlyPriceDisplay : featuredProduct.originalPriceDisplay;

  return (
    <div className="mb-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 shadow-xs overflow-hidden select-none">
      {/* Top Bar with Flash Deal & Country Region Verification */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-[#847CB8] text-white flex items-center space-x-1.5 shadow-xs">
            <Zap className="w-3.5 h-3.5" />
            <span>MEJOR OFERTA ARNO DEL DÍA</span>
          </span>

          <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-[#A7D792]/15 px-3 py-1 rounded-full border border-[#A7D792]/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SE PUEDE ACTIVAR EN TU PAÍS ✓</span>
          </div>
        </div>

        {/* Billing Switch */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Facturación:</span>
          <div className="bg-[var(--color-sidebar)] border border-[var(--color-border)] p-1 rounded-2xl flex items-center space-x-1">
            <button
              onClick={() => onToggleBillingCycle('monthly')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#847CB8] text-white shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => onToggleBillingCycle('yearly')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
                billingCycle === 'yearly'
                  ? 'bg-[#847CB8] text-white shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <span>Anual</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-white/20 text-white">
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Deal Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Information */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#847CB8] text-white">
              {featuredProduct.regionBadge}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FF66C4]/15 text-[#FF66C4] border border-[#FF66C4]/30">
              -{featuredProduct.discountPercent}% DESCUENTO
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text)] tracking-tight">
            {featuredProduct.name}
          </h2>

          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl">
            {featuredProduct.description} Clave oficial verificada con soporte para Claude Opus 5, Claude Sonnet 4.6 y GPT-4o sin límites de velocidad.
          </p>

          {/* Model Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {featuredProduct.modelsIncluded.map((model, i) => (
              <span key={i} className="px-2.5 py-1 rounded-xl bg-[var(--color-sidebar)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-muted)] flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#847CB8]" />
                <span>{model}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Price & Buy Box */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[var(--color-sidebar)] border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--color-text-muted)] uppercase">Vendedor Elegido</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {featuredProduct.sellerFeedbackPercent}% Feedback positivo
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              {featuredProduct.numericOriginalPrice && (
                <span className="text-xs font-semibold text-[var(--color-text-muted)] line-through">
                  S/ {(featuredProduct.numericOriginalPrice * 3.75).toFixed(2)} PEN
                </span>
              )}
              <span className="text-3xl font-black text-[var(--color-text)] tracking-tight">
                S/ {(featuredProduct.numericPrice * 3.75).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-[var(--color-text-muted)]">
                PEN
              </span>
            </div>

            {featuredProduct.g2aPlusPriceDisplay && (
              <div className="p-2 rounded-xl bg-[#FF66C4]/10 border border-[#FF66C4]/30 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-[#FF66C4] font-extrabold">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Con Arno Pass:</span>
                </div>
                <span className="font-black text-[#FF66C4]">S/ {((featuredProduct.numericPrice * 0.85) * 3.75).toFixed(2)} PEN</span>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => onBuyNow(featuredProduct)}
              className="w-full py-3 px-4 rounded-2xl bg-[#847CB8] hover:bg-[#6F66A8] text-white text-xs font-black uppercase transition cursor-pointer shadow-md flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>COMPRAR AHORA</span>
            </button>

            <button
              onClick={() => onAddToCart(featuredProduct)}
              className="w-full py-2.5 px-4 rounded-2xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#847CB8]" />
              <span>Añadir a mi Carrito</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
