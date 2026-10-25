import React from 'react';
import { Product } from '../types/store';
import { PRODUCTS } from '../data/products';
import { Sparkles, Code2, Gem, Shield, ArrowRight } from 'lucide-react';

interface Props {
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const G2APosterHero: React.FC<Props> = ({
  onSelectProduct,
  onQuickView,
}) => {
  return (
    <div className="relative mb-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 shadow-xs select-none overflow-hidden">
      {/* Background Subtle Gradient & Character Frame */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#847CB8]/10 via-transparent to-[#FF66C4]/10 pointer-events-none" />

      {/* Grid of 4 Vertical Poster Cards (Matching G2A Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {/* Poster 1: PROMO - BACK TO CODE */}
        <div
          onClick={() => onSelectProduct(PRODUCTS[0])}
          className="rounded-3xl bg-[#1E1C21] text-white p-5 h-80 flex flex-col justify-between shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer relative overflow-hidden group border border-white/10"
        >
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-red-600 text-white tracking-wider">
              PROMO
            </span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center shadow-md">
              <Code2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black tracking-tight leading-tight uppercase">
              BACK TO CODE
            </h3>
            <p className="text-xs text-zinc-300 line-clamp-2">
              VS Code, JetBrains, Copilot y más a precios increíbles.
            </p>
          </div>

          <div className="text-[11px] font-bold text-zinc-400 flex items-center justify-between border-t border-white/10 pt-3">
            <span>Ver Colección</span>
            <ArrowRight className="w-4 h-4 text-[#847CB8] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Poster 2: MÁS VENDIDOS - ARNOAI COPILOT */}
        <div
          onClick={() => onSelectProduct(PRODUCTS[0])}
          className="rounded-3xl bg-[#847CB8] text-white p-5 h-80 flex flex-col justify-between shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-[#FF66C4] text-white tracking-wider shadow-xs">
              MÁS VENDIDOS
            </span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shadow-md">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-black tracking-tight leading-tight uppercase">
              ARNOAI COPILOT: VS CODE & JETBRAINS
            </h3>
            <p className="text-[11px] text-white/80 font-semibold">
              Microsoft Store • Cuenta • GLOBAL
            </p>
          </div>

          <div className="text-xs font-black text-white flex items-center justify-between border-t border-white/20 pt-3">
            <span>$9.00 USD / mes</span>
            <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px]">
              -25% OFF
            </span>
          </div>
        </div>

        {/* Poster 3: MÁS VENDIDOS - GEMINI PRO & CLAUDE 4.6 */}
        <div
          onClick={() => onSelectProduct(PRODUCTS[2])}
          className="rounded-3xl bg-[#1E1C21] text-white p-5 h-80 flex flex-col justify-between shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer relative overflow-hidden group border border-white/10"
        >
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-[#FF66C4] text-white tracking-wider shadow-xs">
              MÁS VENDIDOS
            </span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-md">
              <Gem className="w-8 h-8 text-[#FF66C4]" />
            </div>
            <h3 className="text-lg font-black tracking-tight leading-tight uppercase">
              GEMINI PRO & CLAUDE 4.6
            </h3>
            <p className="text-[11px] text-zinc-300 font-semibold">
              Enlace de activación • GLOBAL
            </p>
          </div>

          <div className="text-xs font-black text-white flex items-center justify-between border-t border-white/10 pt-3">
            <span>$29.00 USD / mes</span>
            <span className="px-2 py-0.5 rounded bg-[#FF66C4] text-white text-[10px]">
              -35% OFF
            </span>
          </div>
        </div>

        {/* Poster 4: RESERVAR - ENTERPRISE DEDICATED */}
        <div
          onClick={() => onSelectProduct(PRODUCTS[5])}
          className="rounded-3xl bg-[#171519] text-white p-5 h-80 flex flex-col justify-between shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer relative overflow-hidden group border border-white/10"
        >
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-zinc-800 text-zinc-300 tracking-wider">
              RESERVAR
            </span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#847CB8]/20 border border-[#847CB8]/30 flex items-center justify-center shadow-md">
              <Shield className="w-8 h-8 text-[#847CB8]" />
            </div>
            <h3 className="text-lg font-black tracking-tight leading-tight uppercase">
              ARNOAI ENTERPRISE DEDICATED
            </h3>
            <p className="text-[11px] text-zinc-400 font-semibold">
              Cloud • Cuenta • GLOBAL
            </p>
          </div>

          <div className="text-xs font-black text-white flex items-center justify-between border-t border-white/10 pt-3">
            <span>A convenir</span>
            <span className="text-[#847CB8] font-bold">Contactar →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
