import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (subtotal: number, discount: number) => void;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((acc, item) => {
    return acc + item.product.numericPrice * item.quantity;
  }, 0);

  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (coupon.trim().toUpperCase() === 'ARNOAI10' || coupon.trim().toUpperCase() === 'ARNO10') {
      setDiscountPercent(10);
      setCouponApplied(true);
    } else if (coupon.trim().toUpperCase() === 'ARNO20') {
      setDiscountPercent(20);
      setCouponApplied(true);
    } else {
      setCouponError('Código inválido. Prueba ARNO10 para un 10% OFF.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#847CB8]/15 text-[#847CB8] flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[var(--color-text)]">Tu Carrito</h2>
                <p className="text-[11px] text-[var(--color-text-muted)] font-medium">
                  {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} seleccionados
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center text-[var(--color-text-muted)]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">Tu carrito está vacío</h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Agrega licencias o planes de IA para comenzar tu compra.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Productos</span>
                  <button
                    onClick={onClearCart}
                    className="text-xs text-red-500 hover:underline font-semibold cursor-pointer"
                  >
                    Vaciar carrito
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]/60 flex items-center justify-between space-x-3 shadow-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-extrabold text-[var(--color-text)] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#847CB8] mt-0.5">
                        {item.product.priceDisplay} {item.product.priceUnit}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-1 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] flex items-center justify-center transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[var(--color-text)] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] flex items-center justify-center transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Trash remove button */}
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Coupon Code Section */}
                <div className="pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Código de cupón (ej: ARNO10)"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text)] uppercase font-semibold focus:outline-none focus:border-[#847CB8]"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="py-2 px-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] hover:bg-[#847CB8] hover:text-white transition cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-500 font-semibold mt-1.5 flex items-center space-x-1">
                      <span>✓ Cupón de {discountPercent}% aplicado correctamente.</span>
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-red-500 font-medium mt-1.5">
                      {couponError}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[var(--color-text-muted)]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--color-text)]">S/ {(rawSubtotal * 3.75).toFixed(2)} PEN</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-500 font-semibold">
                    <span>Descuento ({discountPercent}%)</span>
                    <span>-S/ {(discountAmount * 3.75).toFixed(2)} PEN</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-extrabold text-[var(--color-text)] pt-2 border-t border-[var(--color-border)]/50">
                  <span>Total estimado</span>
                  <span className="text-[#847CB8]">S/ {(finalTotal * 3.75).toFixed(2)} PEN</span>
                </div>
              </div>

              <button
                onClick={() => onProceedToCheckout(rawSubtotal, discountAmount)}
                className="w-full py-3 px-4 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center space-x-2 group"
              >
                <span>Proceder al pago</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[var(--color-text-muted)] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Facturación segura • Garantía de entrega inmediata</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
