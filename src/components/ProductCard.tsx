import React, { useState } from 'react';
import { Product } from '../types/store';
import { ShoppingBag, Heart, Key } from 'lucide-react';

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
  const [isLiked, setIsLiked] = useState(false);

  const currentPrice = billingCycle === 'yearly' ? product.numericYearlyPrice : product.numericPrice;
  const pricePEN = (currentPrice * 3.75).toFixed(2);
  const titleId = `product-title-${product.id}`;
  const descId = `product-desc-${product.id}`;

  // Render high quality brand logo/graphic on the clean soft gray window
  const renderBrandVisual = () => {
    const nameLower = product.name.toLowerCase();
    const idLower = product.id.toLowerCase();

    // 1. Gemini / Google (Solid Lila & Minimalist White Graphic - NO Gradients)
    if (nameLower.includes('gemini') || idLower.includes('gemini')) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center shadow-md">
            <svg viewBox="0 0 48 48" className="w-12 h-12" fill="white" aria-hidden="true" focusable="false">
              <path
                d="M24 4C24 15.0457 15.0457 24 4 24C15.0457 24 24 32.9543 24 44C24 32.9543 32.9543 24 44 24C32.9543 24 24 15.0457 24 4Z"
              />
            </svg>
          </div>
          <span className="text-[11px] font-black tracking-widest uppercase text-zinc-600 mt-2">
            Google One
          </span>
        </div>
      );
    }

    // 2. ChatGPT / OpenAI (Solid Emerald & Minimalist Graphic - NO Gradients)
    if (nameLower.includes('chatgpt') || nameLower.includes('openai') || idLower.includes('chatgpt')) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#10A37F] text-white flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-11 h-11" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.02-1.1638a.0804.0804 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.402-.686zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.6648zm-11.4554 4.097L12 10.9572l3.0046 1.7323v3.4646L12 17.8864l-3.0046-1.7323z" />
            </svg>
          </div>
          <span className="text-[11px] font-black tracking-widest uppercase text-zinc-600 mt-2">
            OpenAI GPT-4o
          </span>
        </div>
      );
    }

    // 3. Claude / Anthropic (Solid Amber & Minimalist Graphic - NO Gradients)
    if (nameLower.includes('claude') || idLower.includes('claude')) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-11 h-11" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M12 2L14.39 8.26L21 9.27L16.5 14.14L17.77 21L12 17.77L6.23 21L7.5 14.14L3 9.27L9.61 8.26L12 2Z" />
            </svg>
          </div>
          <span className="text-[11px] font-black tracking-widest uppercase text-zinc-600 mt-2">
            Anthropic 3.5
          </span>
        </div>
      );
    }

    // 4. Microsoft / Office 365 (Solid Red & Minimalist Text - NO Gradients)
    if (nameLower.includes('office') || nameLower.includes('microsoft') || idLower.includes('office')) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#EA3E23] text-white flex items-center justify-center shadow-md">
            <span className="font-black text-2xl tracking-tighter" aria-hidden="true">M365</span>
          </div>
          <span className="text-[11px] font-black tracking-widest uppercase text-zinc-600 mt-2">
            Microsoft Cloud
          </span>
        </div>
      );
    }

    // 5. Canva Pro (Solid Teal & Minimalist Text - NO Gradients)
    if (nameLower.includes('canva') || idLower.includes('canva')) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#00C4CC] text-white flex items-center justify-center shadow-md font-black text-2xl italic">
            Canva
          </div>
          <span className="text-[11px] font-black tracking-widest uppercase text-zinc-600 mt-2">
            Pro Lifetime
          </span>
        </div>
      );
    }

    // Default / Digital Key (Solid Lila - NO Gradients)
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center shadow-md">
          <Key className="w-9 h-9 text-white" aria-hidden="true" focusable="false" />
        </div>
        <span className="text-[11px] font-black tracking-widest uppercase text-zinc-600 mt-2">
          Licencia Oficial
        </span>
      </div>
    );
  };

  const getBrandOrSubtitle = () => {
    if (product.subtitle) return product.subtitle;
    const nameLower = product.name.toLowerCase();
    if (nameLower.includes('gemini')) return 'Google • Cuenta Oficial';
    if (nameLower.includes('chatgpt')) return 'OpenAI • Cuenta Privada';
    if (nameLower.includes('claude')) return 'Anthropic • Consola API';
    if (nameLower.includes('office')) return 'Microsoft • Licencia Original';
    if (nameLower.includes('canva')) return 'Canva • Plan Pro';
    return 'ArnoAI Services • Clave Digital';
  };

  return (
    <article
      tabIndex={0}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={() => onBuyNow(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onBuyNow(product);
        }
      }}
      className="group relative flex flex-col justify-between rounded-[32px] sm:rounded-[36px] bg-white p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#847CB8]/15 select-none cursor-pointer border border-[#E9E9F5] hover:border-[#847CB8]/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#847CB8] focus-visible:ring-offset-2 w-full mx-auto shadow-xs"
    >
      {/* Top Rounded Light Image Window (TALL RECTANGULAR WINDOW) */}
      <div className="relative aspect-[3/3.7] w-full rounded-[26px] bg-[#F4F4F8] flex items-center justify-center overflow-hidden p-6 transition-colors duration-300 group-hover:bg-[#ECECF2]">
        {/* Floating Heart / Favorite Button (Top Right) */}
        <button
          type="button"
          aria-label={isLiked ? `Quitar ${product.name} de tus favoritos` : `Guardar ${product.name} en tus favoritos`}
          aria-pressed={isLiked}
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white text-[#1E1C21] flex items-center justify-center shadow-xs hover:bg-[#F5F5FB] transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#E9E9F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#847CB8]"
        >
          <Heart
            aria-hidden="true"
            focusable="false"
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-[#FF66C4] text-[#FF66C4]' : 'text-[#726C82]'
            }`}
          />
        </button>

        {/* Discount Badge in Arno Accent Pink (Solid Color Fill) */}
        {product.discountPercent ? (
          <div
            aria-label={`Descuento del ${product.discountPercent} por ciento`}
            className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full bg-[#FF66C4] text-white font-black text-[10px] tracking-wider uppercase shadow-xs"
          >
            -{product.discountPercent}%
          </div>
        ) : null}

        {/* Product Visual */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={`Fotografía oficial de ${product.name}`}
            loading="lazy"
            className="max-h-44 w-auto max-w-[85%] object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="transition-transform duration-500 group-hover:scale-105" aria-hidden="true">
            {renderBrandVisual()}
          </div>
        )}
      </div>

      {/* Card Content Body (Rectangular Proportion & Vertical Spacing) */}
      <div className="px-1.5 pt-4 pb-1 flex flex-col justify-between flex-1 min-h-[135px]">
        <div>
          <h3
            id={titleId}
            className="text-base sm:text-lg font-bold text-[#1E1C21] tracking-tight line-clamp-1 group-hover:text-[#847CB8] transition-colors"
          >
            {product.name}
          </h3>
          <p
            id={descId}
            className="text-xs text-[#726C82] font-semibold mt-1 truncate"
          >
            {getBrandOrSubtitle()}
          </p>
        </div>

        {/* Bottom Row: Price & Squircle Action Button in Signature Lila */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-2xl sm:text-[26px] font-black text-[#1E1C21] tracking-tight leading-none" aria-label={`Precio: ${pricePEN} Soles peruanos`}>
              S/ {pricePEN}
            </div>
            <div className="text-[11px] font-semibold text-[#726C82] mt-1.5" aria-label={`Equivalente a ${currentPrice.toFixed(2)} Dólares Americanos`}>
              ${currentPrice.toFixed(2)} USD • Inmediato
            </div>
          </div>

          {/* Squircle Action Button in Signature Lila (#847CB8) */}
          <button
            type="button"
            aria-label={`Añadir ${product.name} a la cesta de compras por S/ ${pricePEN} Soles`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-[20px] bg-[#847CB8] hover:bg-[#6F66A8] text-white flex items-center justify-center shadow-md shadow-[#847CB8]/25 active:scale-95 transition-all cursor-pointer group/btn shrink-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#847CB8] focus-visible:ring-offset-2"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current stroke-[2.2] group-hover/btn:scale-110 transition-transform"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M12 17v-6" />
              <path d="m9 14 3-3 3 3" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};
