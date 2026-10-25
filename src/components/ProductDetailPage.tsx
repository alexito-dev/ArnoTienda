import React, { useState } from 'react';
import { Product } from '../types/store';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Crown,
  Sparkles,
  Download,
  Info,
  Globe,
  User,
  Monitor,
  Check,
  ShoppingBag,
  Zap,
  Star,
  ExternalLink
} from 'lucide-react';
import { ProductReviewsSection } from './ProductReviewsSection';

interface Props {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductDetailPage: React.FC<Props> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedPricingMode, setSelectedPricingMode] = useState<'pass' | 'regular'>('regular');
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const getHeaderSolidBg = () => {
    switch (product.headerBg) {
      case 'purple':
        return 'bg-[#847CB8]';
      case 'pink':
        return 'bg-[#FF66C4]';
      case 'dark-purple':
        return 'bg-[#5C5399]';
      case 'slate':
        return 'bg-[#1E1C21]';
      case 'lavender':
        return 'bg-[#8D85C4]';
      case 'charcoal':
        return 'bg-[#171519]';
      default:
        return 'bg-[#847CB8]';
    }
  };

  const handleAddCartClick = () => {
    onAddToCart(product);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2500);
  };

  const pricePEN = (product.numericPrice * 3.75).toFixed(2);
  const passPricePEN = ((product.numericPrice * 0.85) * 3.75).toFixed(2);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 select-none animate-in fade-in duration-200">
      {/* 1. Breadcrumbs & Back Button */}
      <div className="flex items-center justify-between mb-4 text-xs font-semibold text-[var(--color-text-muted)]">
        <div className="flex items-center space-x-2 truncate">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-[#847CB8] hover:underline font-bold cursor-pointer mr-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </button>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-[var(--color-text)] font-bold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* 2. Product Main Title (Matching G2A Screenshot) */}
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-black text-[var(--color-text)] tracking-tight leading-snug">
          {product.name} - {product.badge || 'Cuenta Privada'} - {product.regionBadge}
        </h1>
      </div>

      {/* 3. Main 3-Column Layout (Matching G2A Screenshot media_1788373434562.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Poster Cover Image (3-4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`w-full h-96 rounded-3xl ${getHeaderSolidBg()} p-6 flex flex-col justify-between relative overflow-hidden shadow-lg border border-[var(--color-border)]`}>
            {/* Top Tag */}
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-xl bg-black/20 text-white font-extrabold text-xs uppercase tracking-wider border border-white/20">
                ArnoAI Official
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#FF66C4] text-white font-black text-xs shadow-xs">
                -{product.discountPercent || 25}% OFF
              </span>
            </div>

            {/* Center Product Graphic */}
            <div className="my-auto flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shadow-md">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                {product.name}
              </h3>
            </div>

            {/* Bottom Right Digital Key Download Badge */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-bold text-white/80">
                Clave Digital • Verificado ✓
              </span>
              <div className="p-2 rounded-xl bg-black/30 backdrop-blur-xs text-white border border-white/20 shadow-xs">
                <Download className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center space-x-3 text-xs font-semibold text-[var(--color-text)]">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <span className="font-extrabold block">Garantía 100% Protegida</span>
              <span className="text-[11px] text-[var(--color-text-muted)]">Reemplazo o reembolso instantáneo en caso de fallos.</span>
            </div>
          </div>
        </div>

        {/* Center Column: Key Specs & Detailed Description (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Key Specs Sheet (Matching G2A Screenshot) */}
          <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Plataforma */}
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[#847CB8] shrink-0">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--color-text-muted)] font-medium block">Plataformas:</span>
                  <span className="font-extrabold text-[var(--color-text)] block">Web, PC & Móvil</span>
                  <span className="text-[10px] text-[#847CB8] font-bold underline cursor-pointer">Consultar guía de activación</span>
                </div>
              </div>

              {/* Activación en País */}
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--color-text-muted)] font-medium block">Puede activarse en:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">Perú & Global</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Sin restricciones de país ✓</span>
                </div>
              </div>

              {/* Tipo */}
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[#847CB8] shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--color-text-muted)] font-medium block">Tipo de Producto:</span>
                  <span className="font-extrabold text-[var(--color-text)] block">{product.badge || 'Cuenta Privada'}</span>
                </div>
              </div>

              {/* Región */}
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[#847CB8] shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--color-text-muted)] font-medium block">Región:</span>
                  <span className="font-extrabold text-[var(--color-text)] block">GLOBAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Description & Benefits */}
          <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-[var(--color-text)] uppercase tracking-wider">
              Descripción del Producto
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              {product.description}
            </p>

            {/* Benefits Checklist */}
            <div className="pt-3 border-t border-[var(--color-border)]/60 space-y-2">
              <span className="text-xs font-extrabold text-[var(--color-text)] block mb-2">
                ¿Qué incluye esta licencia?
              </span>
              {product.checklist.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-[var(--color-text)]">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Included Models Badges */}
            {product.modelsIncluded && product.modelsIncluded.length > 0 && (
              <div className="pt-3 border-t border-[var(--color-border)]/60">
                <span className="text-xs font-extrabold text-[var(--color-text)] block mb-2">
                  Modelos e IA Incluidos:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.modelsIncluded.map((model, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[11px] font-bold text-[#847CB8]"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Seller & Buy Box Card (3 cols) (Matching G2A Screenshot) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-5 shadow-lg relative overflow-hidden">
            {/* Top G2A Plus / Arno Pass Banner */}
            <div className="p-2.5 rounded-2xl bg-[#847CB8] text-white flex items-center justify-between text-xs font-black shadow-xs">
              <div className="flex items-center space-x-1.5">
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Arno Pass Puntos: 190</span>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md uppercase">PRO</span>
            </div>

            {/* Seller Profile Header (Matching G2A Screenshot) */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-wider">
                  VENDEDOR OFICIAL
                </span>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                <div className="w-10 h-10 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center font-black text-sm shadow-xs">
                  A
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-extrabold text-xs text-[var(--color-text)]">{product.sellerName}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                    {product.sellerFeedbackPercent}% Comentarios positivos
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)] font-medium">
                    {product.sellerSales} ventas verificadas
                  </span>
                </div>
              </div>
            </div>

            {/* Radio Options for Pricing (Matching G2A Screenshot) */}
            <div className="space-y-2">
              {/* Option 1: Arno Pass Price */}
              <div
                onClick={() => setSelectedPricingMode('pass')}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  selectedPricingMode === 'pass'
                    ? 'border-[#847CB8] bg-[#847CB8]/10'
                    : 'border-[var(--color-border)] bg-[var(--color-bg)]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="radio"
                    name="pricingMode"
                    checked={selectedPricingMode === 'pass'}
                    onChange={() => setSelectedPricingMode('pass')}
                    className="accent-[#847CB8]"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-[var(--color-text)] block">
                      S/ {passPricePEN} PEN
                    </span>
                    <span className="text-[10px] text-[#847CB8] font-bold block">
                      Descuento especial con Arno Pass
                    </span>
                  </div>
                </div>
              </div>

              {/* Option 2: Regular Price */}
              <div
                onClick={() => setSelectedPricingMode('regular')}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  selectedPricingMode === 'regular'
                    ? 'border-[#847CB8] bg-[#847CB8]/10'
                    : 'border-[var(--color-border)] bg-[var(--color-bg)]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="radio"
                    name="pricingMode"
                    checked={selectedPricingMode === 'regular'}
                    onChange={() => setSelectedPricingMode('regular')}
                    className="accent-[#847CB8]"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-[var(--color-text)] block">
                      S/ {pricePEN} PEN
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)] font-medium block">
                      Tarifa regular (${product.numericPrice.toFixed(2)} USD)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddCartClick}
                className="w-full py-3 px-4 rounded-2xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-extrabold text-xs transition cursor-pointer shadow-md flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAddedToCart ? '¡Añadido al Carrito! ✓' : 'Añadir al Carrito'}</span>
              </button>

              <button
                onClick={() => onBuyNow(product)}
                className="w-full py-3 px-4 rounded-2xl bg-[#FF66C4] hover:bg-[#E555B0] text-white font-extrabold text-xs transition cursor-pointer shadow-md flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Comprar Ahora</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Verified Buyer Reviews Section */}
      <div className="mt-8">
        <ProductReviewsSection />
      </div>
    </div>
  );
};
