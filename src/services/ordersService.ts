import { CartItem, Product } from '../types/store';

export interface SavedOrder {
  id: string;
  date: string;
  items: {
    productName: string;
    quantity: number;
    pricePEN: number;
    activationKey: string;
    badge?: string;
  }[];
  totalPEN: number;
  paymentMethod: string;
  status: 'entregado' | 'procesando';
}

const ORDERS_KEY = 'arno_orders_history';

export const getSavedOrders = (): SavedOrder[] => {
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveOrderHistory = (
  orderId: string,
  cartItems: CartItem[],
  singleProduct: Product | null | undefined,
  totalPEN: number,
  paymentMethod: string
): SavedOrder => {
  const items = cartItems.length > 0
    ? cartItems.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        pricePEN: Math.round(item.product.numericPrice * 3.75 * 10) / 10,
        activationKey: item.product.activationKeySample || `ARNO-KEY-${Date.now().toString().slice(-6)}`,
        badge: item.product.badge,
      }))
    : singleProduct
    ? [{
        productName: singleProduct.name,
        quantity: 1,
        pricePEN: Math.round(singleProduct.numericPrice * 3.75 * 10) / 10,
        activationKey: singleProduct.activationKeySample || `ARNO-KEY-${Date.now().toString().slice(-6)}`,
        badge: singleProduct.badge,
      }]
    : [];

  const newOrder: SavedOrder = {
    id: orderId,
    date: new Date().toLocaleDateString('es-PE') + ' ' + new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    items,
    totalPEN,
    paymentMethod,
    status: 'entregado',
  };

  const existing = getSavedOrders();
  const updated = [newOrder, ...existing];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

  window.dispatchEvent(new Event('arno_orders_updated'));
  return newOrder;
};
