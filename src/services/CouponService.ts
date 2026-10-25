export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number; // 10% or $2.00
  description: string;
}

const VALID_COUPONS: Record<string, Coupon> = {
  ARNO10: {
    code: 'ARNO10',
    type: 'percent',
    value: 10,
    description: '10% de descuento en todo el carrito',
  },
  BIENVENIDA: {
    code: 'BIENVENIDA',
    type: 'fixed',
    value: 2.0,
    description: '$2.00 USD de descuento de bienvenida',
  },
  LANZAMIENTO: {
    code: 'LANZAMIENTO',
    type: 'percent',
    value: 15,
    description: '15% de descuento especial de lanzamiento',
  },
};

export const validateCoupon = (code: string): { success: boolean; coupon?: Coupon; error?: string } => {
  const cleanCode = (code || '').trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, error: 'Por favor ingresa un código de cupón' };
  }

  const found = VALID_COUPONS[cleanCode];
  if (found) {
    return { success: true, coupon: found };
  }

  return { success: false, error: 'Código de cupón no válido o expirado' };
};
