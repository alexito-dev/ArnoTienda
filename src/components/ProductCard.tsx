import React from 'react';
import { Product } from '../types/store';
import { Zap } from 'lucide-react';

interface Props {
  product: Product;
  billingCycle: 'monthly' | 'yearly';
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({
  product,
  billingCycle,
  onAddToCart,
  onBuyNow,
}) => {
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

  const currentPrice = billingCycle === 'yearly' ? product.numericYearlyPrice : product.numericPrice;
  const pricePEN = (currentPrice * 3.75).toFixed(2);
  const origPricePEN = product.numericOriginalPrice ? (product.numericOriginalPrice * 3.75).toFixed(2) : null;

  return (
    <div
      className="flex flex-col select-none group cursor-pointer rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs hover:shadow-xl hover:border-[#847CB8]/50 transition-all duration-200 justify-between min-h-[350px] max-w-[230px] mx-auto w-full overflow-hidden"
      onClick={() => onBuyNow(product)}
    >
      {/* 100% Flush Edge-to-Edge Image Header */}
      <div className={`h-52 w-full ${getHeaderSolidBg()} relative overflow-hidden shrink-0 flex flex-col justify-between p-3`}>
        {/* Full Bleed Image */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover absolute inset-0 z-0 transition-transform group-hover:scale-105 duration-300"
          />
        ) : (
          <div className="absolute inset-0 z-0 flex items-center justify-center p-4 text-center">
            <span className="text-sm font-black text-white/90 line-clamp-2 drop-shadow-md">
              {product.name}
            </span>
          </div>
        )}

        {/* Discount Badge in Top Right Corner */}
        <div className="flex justify-end z-10">
          {product.discountPercent ? (
            <span className="px-2 py-0.5 rounded-md bg-[#FF66C4] text-white font-black text-[10px] shadow-md">
              -{product.discountPercent}%
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-black text-[var(--color-text)] line-clamp-2 leading-snug group-hover:text-[#847CB8] transition-colors">
            {product.name}
          </h4>
          <div className="flex items-center justify-between text-[11px] mt-1">
            <span className="font-semibold text-[var(--color-text-muted)] truncate">
              {product.subtitle || 'Licencia Digital'}
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[10px] shrink-0 ml-1">
              GLOBAL
            </span>
          </div>
        </div>

        {/* Bottom Price & Quick Action (Soles Peruanos S/ PEN) */}
        <div className="pt-2 border-t border-[var(--color-border)]/40 flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-[var(--color-text)] tracking-tight">
              S/ {pricePEN} <span className="text-[9px] font-bold text-[var(--color-text-muted)]">PEN</span>
            </div>
            {origPricePEN && (
              <div className="text-[10px] font-medium text-[var(--color-text-muted)] line-through">
                S/ {origPricePEN} PEN
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="p-2 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white transition cursor-pointer shadow-xs group-hover:scale-105"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
