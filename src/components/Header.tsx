import React from 'react';
import { ShoppingBag, Search, User, Crown, Settings, Wallet, Key, Sparkles } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { CategoryId } from '../types/store';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAIWizard: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onOpenWallet: () => void;
  onOpenOrders: () => void;
  walletBalance: number;
  user: { name: string; email: string } | null;
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

export const Header: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenAIWizard,
  onOpenAdmin,
  onOpenAuth,
  onOpenWallet,
  onOpenOrders,
  walletBalance,
  user,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <header className="w-full select-none sticky top-0 z-30 shadow-sm backdrop-blur-md bg-[#121214]/95 text-white border-b border-white/10">
      {/* Top Launch Announcement Bar */}
      <div className="bg-[#847CB8]/90 backdrop-blur-xs text-white text-[11px] font-bold py-1 px-4 text-center tracking-wide flex items-center justify-center space-x-2 border-b border-white/10 overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
        <span className="truncate">Entrega digital automática 24/7 en menos de 60 segundos</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">Garantía total de reposición oficial</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">Pagos en Soles con Yape, Plin y Tarjetas</span>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
          onClick={() => onSelectCategory('todos')}
        >
          <div className="w-9 h-9 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white">
              Arno<span className="text-[#847CB8]">Tienda</span>
            </span>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-md mx-6 hidden sm:flex items-center">
          <div className="w-full flex items-center bg-white/10 border border-white/15 rounded-2xl overflow-hidden focus-within:border-[#847CB8] transition-colors">
            <Search className="w-4 h-4 text-zinc-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar licencias, Gemini, ChatGPT, Claude API..."
              className="w-full px-3 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none font-medium bg-transparent"
            />
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center space-x-2.5 text-xs font-bold">
          {/* Arno Wallet Balance Button */}
          <Tooltip content="Arno Wallet - Monedero Digital" position="bottom">
            <button
              onClick={onOpenWallet}
              className="py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-white font-extrabold text-xs transition cursor-pointer flex items-center space-x-1.5 border border-amber-500/30 shadow-xs"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-300" />
              <span>S/ {walletBalance.toFixed(2)}</span>
            </button>
          </Tooltip>

          {/* Mis Licencias / Compras Button */}
          <Tooltip content="Mis Licencias Adquiridas" position="bottom">
            <button
              onClick={onOpenOrders}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition cursor-pointer flex items-center space-x-1.5 border border-white/10"
            >
              <Key className="w-3.5 h-3.5 text-[#847CB8]" />
              <span className="hidden lg:inline">Mis Licencias</span>
            </button>
          </Tooltip>

          {/* User Profile / Quick Login Button */}
          <button
            onClick={onOpenAuth}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition cursor-pointer flex items-center space-x-1.5 border border-white/10"
          >
            <User className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{user ? user.name.split(' ')[0] : 'Ingresar'}</span>
          </button>

          {/* Admin Panel Button */}
          <Tooltip content="Panel Administrador" position="bottom">
            <button
              onClick={onOpenAdmin}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition cursor-pointer flex items-center space-x-1.5 border border-white/10"
            >
              <Settings className="w-4 h-4 text-[#FF66C4]" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </Tooltip>

          {/* Cart Icon */}
          <Tooltip content="Ver Carrito de compras" position="bottom">
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer flex items-center justify-center border border-white/10"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-[#847CB8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF66C4] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
