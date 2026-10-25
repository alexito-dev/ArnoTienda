export type CategoryId = 'todos' | 'ide' | 'multimodal' | 'bundle' | 'dev' | 'equipos' | 'corporativo';

export interface Category {
  id: CategoryId;
  label: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: CategoryId;
  badge?: string; // Popular, Best Seller, Flash Deal
  regionBadge: string; // GLOBAL KEY, LATAM KEY, VS CODE
  canActivateInCountry: boolean; // true -> "Can be activated in your country ✓"
  discountPercent?: number; // 25
  originalPriceDisplay?: string; // "$12.00"
  priceDisplay: string; // "$9.00"
  g2aPlusPriceDisplay?: string; // "$7.50" with Arno Pass
  yearlyPriceDisplay: string;
  originalYearlyPriceDisplay?: string;
  priceUnit: string;
  numericPrice: number;
  numericYearlyPrice: number;
  numericOriginalPrice?: number;
  sellerName: string; // "ArnoAI Official"
  sellerRating: number; // 4.9
  sellerFeedbackPercent: number; // 99.8
  sellerSales: number; // 1840
  shieldIncluded: boolean; // true
  headerBg: 'purple' | 'pink' | 'dark-purple' | 'slate' | 'lavender' | 'charcoal';
  iconType: 'spark' | 'diamond' | 'hexagon' | 'code' | 'pentagon' | 'target' | 'zap' | 'bot';
  description: string;
  checklist: string[];
  modelsIncluded: string[];
  specs: ProductSpec[];
  idealFor: string;
  activationKeySample: string;
  imageUrl?: string;
  isActive?: boolean;
  isContactOnly?: boolean;
  buttonLabel?: string;
  bunaiProductId?: string;
  bunaiStock?: number;
  wholesalePriceUSD?: number;
  providerId?: string;
  providerName?: string;
  providerProductId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  billingCycle: 'monthly' | 'yearly';
}

export interface CheckoutDetails {
  fullName: string;
  email: string;
  paymentMethod: 'card' | 'paypal' | 'crypto';
  cardNumber?: string;
  cardExp?: string;
  cardCvc?: string;
}

export type SortOption = 'featured' | 'bestsellers' | 'discount' | 'price-asc' | 'price-desc' | 'rating';

export interface Provider {
  id: string;
  name: string;
  type: 'bunaistore' | 'g2a' | 'kinguin' | 'custom';
  apiBaseUrl: string;
  apiKey?: string;
  apiSecret?: string;
  authHeaderName?: string;
  pingEndpoint?: string;
  balanceUSD: number;
  status: 'active' | 'inactive' | 'error';
  autoFulfill: boolean;
  marginMultiplier: number;
  notes?: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePEN: number;
  activationKey: string;
  badge?: string;
  providerId?: string;
  providerProductId?: string;
  providerStatus?: 'entregado' | 'pendiente' | 'error';
}

export interface StoreOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: string;
  totalPEN: number;
  status: 'completado' | 'pendiente' | 'reembolsado';
  fulfillmentStatus: 'entregado' | 'pendiente' | 'error';
  items: StoreOrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface StoreMetrics {
  totalOrders: number;
  totalSalesPEN: number;
  estimatedCostPEN: number;
  netProfitPEN: number;
  marginPercent: number;
  activeProductsCount: number;
  activeProvidersCount: number;
  totalProvidersCount: number;
  providers: {
    id: string;
    name: string;
    type: string;
    status: string;
    balanceUSD: number;
    productCount: number;
  }[];
}

export interface StoreSettings {
  exchangeRatePEN: string;
  storeName: string;
  defaultMarginMultiplier: string;
  autoFulfill: string;
  supportWhatsapp?: string;
}

