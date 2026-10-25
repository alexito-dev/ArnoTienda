import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Sparkles } from 'lucide-react';

const RECENT_SALES = [
  { name: 'Carlos M.', city: 'Madrid, España', product: 'ArnoAI Pro', time: 'Hace 2 min' },
  { name: 'DevStudio Inc.', city: 'Ciudad de México', product: 'API Access', time: 'Hace 5 min' },
  { name: 'Alejandro R.', city: 'Buenos Aires', product: 'ArnoAI Copilot', time: 'Hace 8 min' },
  { name: 'TechLabs Corp.', city: 'Bogotá, Colombia', product: 'ArnoAI Teams', time: 'Hace 12 min' },
  { name: 'Sofia V.', city: 'Santiago, Chile', product: 'ArnoAI Vision', time: 'Hace 15 min' },
];

export const LiveSalesTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RECENT_SALES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const sale = RECENT_SALES[currentIndex];

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-xs animate-in slide-in-from-bottom-5 duration-300 select-none">
      <div className="p-3 rounded-2xl bg-[#1E1C21] text-white border border-white/15 shadow-2xl flex items-center space-x-3 relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-white/10"
        >
          <X className="w-3 h-3" />
        </button>

        <div className="w-9 h-9 rounded-xl bg-[#847CB8] text-white flex items-center justify-center shrink-0 shadow-md">
          <ShoppingBag className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="truncate">{sale.name} ({sale.city})</span>
          </div>
          <p className="text-xs font-bold text-white truncate">
            Adquirió <span className="text-[#FF66C4]">{sale.product}</span>
          </p>
          <span className="text-[9px] text-zinc-400 block -mt-0.5">{sale.time} • Entrega inmediata</span>
        </div>
      </div>
    </div>
  );
};
