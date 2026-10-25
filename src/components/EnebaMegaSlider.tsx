import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, ArrowRight, Clock, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { Product } from '../types/store';
import { PRODUCTS } from '../data/products';

interface Props {
  billingCycle: 'monthly' | 'yearly';
  onToggleBillingCycle: (cycle: 'monthly' | 'yearly') => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const EnebaMegaSlider: React.FC<Props> = ({
  billingCycle,
  onToggleBillingCycle,
  onAddToCart,
  onQuickView,
}) => {
  // Flash Sale countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProduct = PRODUCTS.find((p) => p.id === 'arnoai-pro') || PRODUCTS[2];
  const displayPrice = billingCycle === 'yearly' ? featuredProduct.yearlyPriceDisplay : featuredProduct.priceDisplay;
  const originalPrice = billingCycle === 'yearly' ? featuredProduct.originalYearlyPriceDisplay : featuredProduct.originalPriceDisplay;

  return (
    <div className="mb-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 shadow-sm overflow-hidden select-none">
      {/* Top Banner Bar with Flash Sale Timer */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FF66C4] text-white flex items-center space-x-1.5 shadow-xs">
            <Tag className="w-3.5 h-3.5" />
            <span>OFERTA RELÁMPAGO EN CLAVES</span>
          </span>
          <div className="flex items-center space-x-1 text-xs font-mono font-bold text-[var(--color-text)] bg-[var(--color-sidebar)] px-3 py-1 rounded-full border border-[var(--color-border)]">
            <Clock className="w-3.5 h-3.5 text-[#FF66C4]" />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>

        {/* Billing Cycle Switch */}
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

      {/* Featured Mega Deal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Info Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#847CB8] text-white">
              {featuredProduct.regionBadge}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#A7D792]/20 text-emerald-700 dark:text-emerald-400">
              ⚡ Clave Digital Instantánea
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text)] tracking-tight">
            {featuredProduct.name}
          </h2>

          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl">
            {featuredProduct.description} Incluye acceso prioritario a Claude Opus 5, Claude Sonnet 4.6 y GPT-4o sin límites de velocidad.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {featuredProduct.modelsIncluded.map((model, i) => (
              <span key={i} className="px-2.5 py-1 rounded-xl bg-[var(--color-sidebar)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-muted)] flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#847CB8]" />
                <span>{model}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Deal Buy Box Column */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[var(--color-sidebar)] border border-[var(--color-border)] space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase">Precio de Oferta</span>
            {featuredProduct.discountPercent && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FF66C4] text-white shadow-xs">
                -{featuredProduct.discountPercent}% OFF
              </span>
            )}
          </div>

          <div className="flex items-baseline space-x-2">
            {originalPrice && (
              <span className="text-sm font-semibold text-[var(--color-text-muted)] line-through">
                {originalPrice}
              </span>
            )}
            <span className="text-3xl font-black text-[#847CB8] tracking-tight">
              {displayPrice}
            </span>
            <span className="text-xs font-bold text-[var(--color-text-muted)]">
              {featuredProduct.priceUnit}
            </span>
          </div>

          <p className="text-[11px] text-[var(--color-text-muted)]">
            Vendido por <strong className="text-[var(--color-text)]">{featuredProduct.sellerName}</strong> (⭐ {featuredProduct.sellerRating})
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => onAddToCart(featuredProduct)}
              className="w-full py-3 px-4 rounded-2xl bg-[#847CB8] hover:bg-[#6F66A8] text-white text-xs font-extrabold transition cursor-pointer shadow-md flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Añadir a mi Carrito</span>
            </button>

            <button
              onClick={() => onQuickView(featuredProduct)}
              className="w-full py-2.5 px-4 rounded-2xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] transition cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>Ver Ficha Técnica</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
