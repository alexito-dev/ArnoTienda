import React from 'react';
import { ShoppingBag, Search, User, Settings, Wallet, Key, Sparkles } from 'lucide-react';
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
    <header role="banner" className="w-full select-none sticky top-0 z-30 shadow-xs backdrop-blur-xl bg-white/95 text-[#1E1C21] border-b border-[#E9E9F5]">
      {/* Skip to Main Content Link (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#847CB8] focus:text-white focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#847CB8] font-bold text-xs"
      >
        Saltar al contenido principal
      </a>

      {/* Top Announcement Bar in Signature Lila */}
      <aside aria-label="Aviso promocional" className="bg-[#847CB8] text-white text-[11px] font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center space-x-2 overflow-hidden shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" aria-hidden="true" focusable="false" />
        <span className="truncate">Entrega digital automática 24/7 en menos de 60 segundos</span>
        <span className="hidden sm:inline" aria-hidden="true">•</span>
        <span className="hidden sm:inline">Garantía total oficial</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">Pagos en Soles con Yape, Plin y Tarjetas</span>
      </aside>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo in Arno Signature Lila */}
        <button
          type="button"
          aria-label="Ir a la página de inicio de ArnoTienda"
          className="flex items-center space-x-3 cursor-pointer group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#847CB8] rounded-2xl"
          onClick={() => onSelectCategory('todos')}
        >
          <div className="w-10 h-10 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform shadow-[#847CB8]/25" aria-hidden="true">
            A
          </div>
          <span className="font-black text-xl tracking-tight text-[#1E1C21]">
            Arno<span className="text-[#847CB8]">Tienda</span>
          </span>
        </button>

        {/* Center Search Input */}
        <div className="flex-1 max-w-md mx-6 hidden sm:flex items-center">
          <label htmlFor="header-catalog-search" className="sr-only">
            Buscar en el catálogo de productos y licencias
          </label>
          <div className="w-full flex items-center bg-[#F5F5FB] border border-[#E9E9F5] rounded-full overflow-hidden focus-within:border-[#847CB8] focus-within:ring-2 focus-within:ring-[#847CB8]/20 transition-all">
            <Search className="w-4 h-4 text-[#726C82] ml-4 shrink-0" aria-hidden="true" focusable="false" />
            <input
              id="header-catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar Gemini, ChatGPT, Claude, Office 365..."
              className="w-full px-3.5 py-2 text-xs text-[#1E1C21] placeholder-[#726C82] focus:outline-none font-medium bg-transparent"
            />
          </div>
        </div>

        {/* Right Tools & Navigation Buttons */}
        <nav aria-label="Menú de usuario y herramientas" className="flex items-center space-x-2 text-xs font-bold">
          {/* Arno Wallet Balance Button */}
          <Tooltip content="Arno Wallet - Monedero Digital" position="bottom">
            <button
              type="button"
              aria-label={`Billetera Arno: saldo disponible de S/ ${walletBalance.toFixed(2)} Soles`}
              onClick={onOpenWallet}
              className="py-2 px-3.5 rounded-full bg-amber-50 hover:bg-amber-100/80 text-amber-900 font-bold transition cursor-pointer flex items-center space-x-1.5 border border-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-xs"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" focusable="false" />
              <span>S/ {walletBalance.toFixed(2)}</span>
            </button>
          </Tooltip>

          {/* Mis Licencias / Compras Button */}
          <Tooltip content="Mis Licencias Adquiridas" position="bottom">
            <button
              type="button"
              aria-label="Abrir panel de mis licencias adquiridas y claves de activación"
              onClick={onOpenOrders}
              className="py-2 px-3.5 rounded-full bg-[#F5F5FB] hover:bg-[#E9E9F5] text-[#1E1C21] transition cursor-pointer flex items-center space-x-1.5 border border-[#E9E9F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#847CB8]"
            >
              <Key className="w-3.5 h-3.5 text-[#847CB8]" aria-hidden="true" focusable="false" />
              <span className="hidden lg:inline">Mis Licencias</span>
            </button>
          </Tooltip>

          {/* User Profile / Quick Login Button */}
          <button
            type="button"
            aria-label={user ? `Cuenta de usuario: ${user.name}` : 'Iniciar sesión en la tienda'}
            onClick={onOpenAuth}
            className="py-2 px-3.5 rounded-full bg-[#F5F5FB] hover:bg-[#E9E9F5] text-[#1E1C21] transition cursor-pointer flex items-center space-x-1.5 border border-[#E9E9F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#847CB8]"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" focusable="false" />
            <span className="hidden sm:inline">{user ? user.name.split(' ')[0] : 'Ingresar'}</span>
          </button>

          {/* Admin Panel Button */}
          <Tooltip content="Panel de Administración" position="bottom">
            <button
              type="button"
              aria-label="Abrir panel de control administrativo"
              onClick={onOpenAdmin}
              className="py-2 px-3 rounded-full bg-[#F5F5FB] hover:bg-[#E9E9F5] text-[#FF66C4] transition cursor-pointer flex items-center space-x-1 border border-[#E9E9F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF66C4]"
            >
              <Settings className="w-3.5 h-3.5" aria-hidden="true" focusable="false" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </Tooltip>

          {/* Cart Button in Signature Lila (#847CB8) */}
          <button
            type="button"
            aria-label={`Ver cesta de compras: ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}`}
            onClick={onOpenCart}
            className="relative py-2 px-4 rounded-full bg-[#847CB8] hover:bg-[#6F66A8] text-white font-bold transition cursor-pointer flex items-center space-x-1.5 active:scale-95 shadow-md shadow-[#847CB8]/25 ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#847CB8]"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" aria-hidden="true" focusable="false" />
            <span className="text-xs">Cesta</span>
            {cartCount > 0 && (
              <span
                aria-label={`${cartCount} artículos`}
                className="ml-1 bg-[#FF66C4] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs"
              >
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
