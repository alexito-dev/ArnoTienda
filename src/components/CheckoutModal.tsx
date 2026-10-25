import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle2, Lock, QrCode, Shield, Copy, Check, Sparkles, Building2, Wallet, Plus } from 'lucide-react';
import { CartItem, Product } from '../types/store';
import { getWalletBalance, payWithWallet } from '../services/walletService';
import { saveOrderHistory } from '../services/ordersService';
import { api } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  singleProduct?: Product | null;
  subtotal: number;
  discount: number;
  onSuccessOrder: () => void;
  onOpenWalletRecharge?: () => void;
}

export const CheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  singleProduct,
  subtotal,
  discount,
  onSuccessOrder,
  onOpenWalletRecharge,
}) => {
  const [paymentTab, setPaymentTab] = useState<'wallet' | 'yape' | 'card' | 'paypal' | 'crypto'>('wallet');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [walletBalance, setWalletBalance] = useState<number>(0);

  // Yape / Plin fields
  const [operationCode, setOperationCode] = useState('');

  // Card / Openpay fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Crypto fields
  const [cryptoNetwork, setCryptoNetwork] = useState<'trc20' | 'bep20' | 'btc'>('trc20');
  const [cryptoTxid, setCryptoTxid] = useState('');
  const [copiedWallet, setCopiedWallet] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const balance = getWalletBalance();
      setWalletBalance(balance);
      if (balance <= 0) {
        setPaymentTab('yape');
      } else {
        setPaymentTab('wallet');
      }
      setWalletError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalUSD = Math.max(0, subtotal - discount);
  const totalPENNum = singleProduct 
    ? Math.round(singleProduct.numericPrice * 3.75 * 10) / 10 
    : Math.round(totalUSD * 3.75 * 10) / 10;
  const totalPEN = totalPENNum.toFixed(2);

  const walletAddress = cryptoNetwork === 'trc20'
    ? 'TArnoAI89xKEY291zMvK2L9x11029481Xz'
    : cryptoNetwork === 'bep20'
    ? '0x847CB8921a4f02819830192318721987391823'
    : '1ArnoAiBtcWallet991823091823901823';

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWalletError(null);

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const methodStr = paymentTab === 'wallet' 
      ? 'Arno Wallet (Saldo)' 
      : paymentTab === 'yape' 
      ? 'Yape / Plin' 
      : paymentTab === 'card' 
      ? 'Tarjeta Visa/Mastercard' 
      : paymentTab === 'paypal' 
      ? 'PayPal' 
      : 'Criptomonedas';

    if (paymentTab === 'wallet') {
      const payRes = payWithWallet(totalPENNum, `Compra Orden #${orderId}`);
      if (!payRes.success) {
        setWalletError(payRes.error || 'Saldo insuficiente');
        return;
      }
    }

    setIsProcessing(true);

    // Save order in local history
    saveOrderHistory(orderId, cartItems, singleProduct, totalPENNum, methodStr);

    // Format order items for backend
    const orderItems = cartItems.length > 0
      ? cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          pricePEN: Math.round(item.product.numericPrice * 3.75 * 10) / 10,
          activationKey: item.product.activationKeySample || `ARNO-KEY-${Date.now().toString().slice(-6)}`,
          badge: item.product.badge,
          providerId: item.product.providerId || (item.product.bunaiProductId ? 'bunaistore' : 'local'),
          providerProductId: item.product.providerProductId || item.product.bunaiProductId,
          providerStatus: 'entregado' as const,
        }))
      : singleProduct
      ? [{
          productId: singleProduct.id,
          productName: singleProduct.name,
          quantity: 1,
          pricePEN: Math.round(singleProduct.numericPrice * 3.75 * 10) / 10,
          activationKey: singleProduct.activationKeySample || `ARNO-KEY-${Date.now().toString().slice(-6)}`,
          badge: singleProduct.badge,
          providerId: singleProduct.providerId || (singleProduct.bunaiProductId ? 'bunaistore' : 'local'),
          providerProductId: singleProduct.providerProductId || singleProduct.bunaiProductId,
          providerStatus: 'entregado' as const,
        }]
      : [];

    // Persist order in store backend database
    api.createOrder({
      id: orderId,
      customerName: fullName || 'Cliente ArnoTienda',
      customerEmail: email || '',
      paymentMethod: methodStr,
      totalPEN: totalPENNum,
      items: orderItems,
      notes: `Compra realizada mediante ${methodStr}`,
    }).catch((err) => console.warn('[Orders] Error guardando pedido en backend:', err));

    // Automated fulfillment dispatch for BunaiStore items
    if (singleProduct && (singleProduct.bunaiProductId || singleProduct.badge === 'BUNAISTORE')) {
      const pid = singleProduct.bunaiProductId || singleProduct.id.replace('bunai-', '');
      api.orderBunaiProduct(pid, 1).catch((err) => console.warn('[BunaiStore] Orden procesada:', err));
    } else {
      cartItems.forEach((item) => {
        if (item.product.bunaiProductId || item.product.badge === 'BUNAISTORE') {
          const pid = item.product.bunaiProductId || item.product.id.replace('bunai-', '');
          api.orderBunaiProduct(pid, item.quantity).catch((err) => console.warn('[BunaiStore] Orden procesada:', err));
        }
      });
    }

    setTimeout(() => {
      setIsProcessing(false);
      onSuccessOrder();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-sidebar)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center font-bold shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[var(--color-text)]">
                {singleProduct ? `Solicitud: ${singleProduct.name}` : 'Pasarela de Pago Segura'}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">
                Paga con Saldo Arno Wallet, Yape, Plin, Tarjetas o Cripto
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Order Summary Box */}
          <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-2">
            <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block">
              Resumen del Pedido
            </span>
            {singleProduct ? (
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text)]">
                <span>{singleProduct.name}</span>
                <span className="text-[#847CB8] font-bold">S/ {totalPEN} PEN</span>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs font-medium text-[var(--color-text)]">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="font-semibold text-[var(--color-text)]">S/ {(item.product.numericPrice * item.quantity * 3.75).toFixed(2)} PEN</span>
                </div>
              ))
            )}
            <div className="pt-2 border-t border-[var(--color-border)]/60 flex items-center justify-between text-sm font-extrabold text-[var(--color-text)]">
              <span>Total a Pagar</span>
              <div className="text-right">
                <span className="text-[#847CB8] text-base font-black block">S/ {totalPEN} PEN</span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium">${totalUSD.toFixed(2)} USD aprox</span>
              </div>
            </div>
          </div>

          {/* Customer Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] mb-1">Nombre completo</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Alexander Torres"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] mb-1">Correo de entrega de licencias</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
              />
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[var(--color-text)]">Selecciona Método de Pago</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
              {/* Tab: Wallet */}
              <button
                type="button"
                onClick={() => setPaymentTab('wallet')}
                className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition cursor-pointer flex flex-col items-center justify-center space-y-1 relative ${
                  paymentTab === 'wallet'
                    ? 'bg-[#847CB8] text-white shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Arno Wallet</span>
                {walletBalance > 0 && (
                  <span className={`text-[9px] font-bold ${paymentTab === 'wallet' ? 'text-amber-200' : 'text-emerald-500'}`}>
                    S/ {walletBalance.toFixed(2)}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('yape')}
                className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  paymentTab === 'yape'
                    ? 'bg-[#847CB8] text-white shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Yape / Plin</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('card')}
                className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  paymentTab === 'card'
                    ? 'bg-[#847CB8] text-white shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('paypal')}
                className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  paymentTab === 'paypal'
                    ? 'bg-[#847CB8] text-white shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <span>PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab('crypto')}
                className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  paymentTab === 'crypto'
                    ? 'bg-[#847CB8] text-white shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <span>USDT / Cripto</span>
              </button>
            </div>

            {/* TAB: WALLET */}
            {paymentTab === 'wallet' && (
              <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5 text-[#847CB8]" />
                    <span className="font-extrabold text-xs text-[var(--color-text)]">
                      Saldo en tu Monedero Arno Wallet
                    </span>
                  </div>
                  <span className="text-sm font-black text-[var(--color-text)]">
                    S/ {walletBalance.toFixed(2)} PEN
                  </span>
                </div>

                {walletBalance >= totalPENNum ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Tienes saldo suficiente para pagar en 1 clic sin pasos adicionales.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                      Saldo insuficiente. Te faltan S/ {(totalPENNum - walletBalance).toFixed(2)} PEN.
                    </div>
                    {onOpenWalletRecharge && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenWalletRecharge();
                        }}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--color-text)] text-xs font-extrabold transition cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <Plus className="w-4 h-4 text-[#847CB8]" />
                        <span>Recargar Saldo en Arno Wallet</span>
                      </button>
                    )}
                  </div>
                )}

                {walletError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                    {walletError}
                  </div>
                )}
              </div>
            )}

            {/* TAB: YAPE / PLIN */}
            {paymentTab === 'yape' && (
              <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-4 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-32 rounded-2xl bg-white border border-zinc-300 p-2 flex flex-col items-center justify-center shrink-0 text-zinc-900 shadow-sm">
                    <QrCode className="w-20 h-20 text-[#847CB8]" />
                    <span className="text-[9px] font-black uppercase text-[#847CB8]">Escanear Yape / Plin</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-center sm:text-left">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#847CB8]/15 text-[#847CB8] font-bold text-[10px] uppercase">
                      Pago Móvil Instantáneo
                    </span>
                    <p className="font-bold text-[var(--color-text)]">
                      Yapear o Plinear exactamente: <span className="text-emerald-500 text-sm font-black">S/ {totalPEN} PEN</span>
                    </p>
                    <p className="text-[var(--color-text-muted)] text-[11px]">
                      A nombre de: <strong className="text-[var(--color-text)]">ArnoAI Services Perú</strong>
                    </p>
                    <p className="text-[var(--color-text-muted)] text-[11px]">
                      Número: <strong className="text-[var(--color-text)] font-mono">900 000 000</strong>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-text)] mb-1">
                    Ingresa el Número de Operación de Yape / Plin *
                  </label>
                  <input
                    type="text"
                    required
                    value={operationCode}
                    onChange={(e) => setOperationCode(e.target.value)}
                    placeholder="Ej: 894102"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                  />
                </div>
              </div>
            )}

            {/* TAB: CARD */}
            {paymentTab === 'card' && (
              <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3 animate-in fade-in duration-150 text-xs">
                <div>
                  <label className="block font-bold text-[var(--color-text)] mb-1">Número de tarjeta</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4000 1234 5678 9010"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[var(--color-text)] mb-1">Vencimiento</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--color-text)] mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PAYPAL */}
            {paymentTab === 'paypal' && (
              <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3 text-xs animate-in fade-in duration-150 text-center">
                <span className="font-extrabold text-[var(--color-text)] block">
                  Pago Internacional con PayPal
                </span>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  Al confirmar tu compra, se procesará el pago de forma segura por ${totalUSD.toFixed(2)} USD vía PayPal.
                </p>
              </div>
            )}

            {/* TAB: CRYPTO */}
            {paymentTab === 'crypto' && (
              <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3 text-xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-text)]">Billetera Oficial USDT</span>
                  <button
                    type="button"
                    onClick={handleCopyWallet}
                    className="text-[10px] font-bold text-[#847CB8] hover:underline flex items-center space-x-1"
                  >
                    {copiedWallet ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedWallet ? 'Copiada' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-[11px] text-amber-400 break-all select-all">
                  {walletAddress}
                </div>
                <div>
                  <label className="block font-bold text-[var(--color-text)] mb-1">Hash de Transacción (TXID) *</label>
                  <input
                    type="text"
                    required
                    value={cryptoTxid}
                    onChange={(e) => setCryptoTxid(e.target.value)}
                    placeholder="Pega el hash o comprobante..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Guarantee & SSL Badges */}
          <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)]/60">
            <div className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Garantía de Entrega 100%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Encriptación SSL 256-Bit</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || (paymentTab === 'wallet' && walletBalance < totalPENNum)}
            className={`w-full py-3.5 rounded-2xl text-white font-extrabold text-xs transition cursor-pointer shadow-md flex items-center justify-center space-x-2 ${
              isProcessing || (paymentTab === 'wallet' && walletBalance < totalPENNum)
                ? 'bg-zinc-600 opacity-60 cursor-not-allowed'
                : 'bg-[#847CB8] hover:bg-[#6F66A8]'
            }`}
          >
            {isProcessing ? (
              <span>Validando Pago y Liberando Clave...</span>
            ) : paymentTab === 'wallet' ? (
              <span>Pagar S/ {totalPEN} con Saldo Arno Wallet</span>
            ) : (
              <span>Confirmar Orden de S/ {totalPEN} PEN</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
