import React from 'react';
import { ShoppingBag, Search, User, Settings, Wallet, Key } from 'lucide-react';
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
  onOpenAdmin,
  onOpenAuth,
  onOpenWallet,
  onOpenOrders,
  walletBalance,
  user,
  onSelectCategory,
}) => {
  return (
    <header className="w-full select-none sticky top-0 z-30 shadow-md backdrop-blur-xl bg-[#0f0f11]/90 text-white border-b border-zinc-800/80">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo (Minimalist & Crisp) */}
        <div
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
          onClick={() => onSelectCategory('todos')}
        >
          <div className="w-10 h-10 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white">
              Arno<span className="text-zinc-400 font-normal">Tienda</span>
            </span>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-md mx-6 hidden sm:flex items-center">
          <div className="w-full flex items-center bg-zinc-900/90 border border-zinc-800 rounded-full overflow-hidden focus-within:border-white transition-colors">
            <Search className="w-4 h-4 text-zinc-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar Gemini, ChatGPT, Claude, Office 365..."
              className="w-full px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none font-medium bg-transparent"
            />
          </div>
        </div>

        {/* Right Tools & Navigation Buttons */}
        <div className="flex items-center space-x-2 text-xs font-bold">
          {/* Arno Wallet Balance Button */}
          <Tooltip content="Arno Wallet - Saldo Disponible" position="bottom">
            <button
              onClick={onOpenWallet}
              className="py-2 px-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white font-bold transition cursor-pointer flex items-center space-x-1.5 border border-zinc-800"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>S/ {walletBalance.toFixed(2)}</span>
            </button>
          </Tooltip>

          {/* Mis Licencias / Compras Button */}
          <Tooltip content="Mis Licencias Adquiridas" position="bottom">
            <button
              onClick={onOpenOrders}
              className="py-2 px-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer flex items-center space-x-1.5 border border-zinc-800"
            >
              <Key className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden lg:inline">Mis Licencias</span>
            </button>
          </Tooltip>

          {/* User Profile / Quick Login Button */}
          <button
            onClick={onOpenAuth}
            className="py-2 px-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer flex items-center space-x-1.5 border border-zinc-800"
          >
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">{user ? user.name.split(' ')[0] : 'Ingresar'}</span>
          </button>

          {/* Admin Panel Button */}
          <Tooltip content="Panel de Administración" position="bottom">
            <button
              onClick={onOpenAdmin}
              className="py-2 px-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer flex items-center space-x-1 border border-zinc-800"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </Tooltip>

          {/* Cart Icon (High Contrast Minimalist) */}
          <button
            onClick={onOpenCart}
            className="relative py-2 px-4 rounded-full bg-white text-zinc-950 font-bold transition cursor-pointer flex items-center space-x-1.5 hover:bg-zinc-100 active:scale-95 shadow-md ml-1"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            <span className="text-xs">Cesta</span>
            {cartCount > 0 && (
              <span className="ml-1 bg-zinc-950 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
