import { Product, Provider, StoreOrder, StoreMetrics, StoreSettings } from '../types/store';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3008/api'
  : '/api';

export interface BunaiProfile {
  user_id: number;
  display_name: string;
  balance: number;
  api_orders: number;
  api_spent: number;
}

export interface BunaiProduct {
  product_id: string;
  variant_id?: string;
  variant_name?: string;
  display_name: string;
  name: string;
  price: number;
  stock_type: 'auto' | 'manual';
  stock_count: number;
  infinite_stock?: boolean;
  warranty_hours: number;
  has_promo?: boolean;
  is_listed?: boolean;
  group_id?: string;
  group_name?: string;
  logo?: string;
  note?: string;
}

export interface BunaiOrderResult {
  order_id?: string;
  status?: string;
  items?: string[];
  product_name?: string;
  detail?: string;
  error?: string;
}

export const api = {
  // Products Management
  async fetchProducts(): Promise<Product[] | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Error al conectar con la base de datos');
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('[API] No se pudo conectar al servidor API SQLite (usando datos locales):', err);
      return null;
    }
  },

  async saveProduct(product: Product): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      return response.ok;
    } catch (err) {
      console.error('[API] Error guardando en la base de datos SQLite:', err);
      return false;
    }
  },

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (err) {
      console.error('[API] Error eliminando de la base de datos SQLite:', err);
      return false;
    }
  },

  async resetDatabase(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/reset`, {
        method: 'POST',
      });
      return response.ok;
    } catch (err) {
      console.error('[API] Error restableciendo la base de datos SQLite:', err);
      return false;
    }
  },

  // Multi-Provider Management
  async fetchProviders(): Promise<Provider[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/providers`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error('[API] Error obteniendo proveedores:', err);
      return [];
    }
  },

  async saveProvider(provider: Partial<Provider>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(provider),
      });
      return response.ok;
    } catch (err) {
      console.error('[API] Error guardando proveedor:', err);
      return false;
    }
  },

  async deleteProvider(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (err) {
      console.error('[API] Error eliminando proveedor:', err);
      return false;
    }
  },

  async testProvider(id: string): Promise<{ success: boolean; status?: string; balanceUSD?: number; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${id}/test`, {
        method: 'POST',
      });
      return await response.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de red' };
    }
  },

  async fetchProviderProducts(id: string, limit = 100): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${id}/products?limit=${limit}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error(`[API] Error obteniendo catalogo del proveedor ${id}:`, err);
      return [];
    }
  },

  async syncProviderProduct(product: Partial<Product>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/sync-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      return response.ok;
    } catch (err) {
      console.error('[API] Error sincronizando producto desde proveedor:', err);
      return false;
    }
  },

  // Orders Management
  async fetchOrders(): Promise<StoreOrder[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error('[API] Error obteniendo pedidos:', err);
      return [];
    }
  },

  async createOrder(order: Partial<StoreOrder>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      return response.ok;
    } catch (err) {
      console.error('[API] Error creando pedido:', err);
      return false;
    }
  },

  async updateOrder(id: string, patch: Partial<StoreOrder>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      return response.ok;
    } catch (err) {
      console.error('[API] Error actualizando pedido:', err);
      return false;
    }
  },

  async dispatchOrder(id: string): Promise<{ success: boolean; message?: string; keys?: string[]; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/dispatch`, {
        method: 'POST',
      });
      const data = await response.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de despacho' };
    }
  },

  // Store Metrics & Settings
  async fetchStoreMetrics(): Promise<StoreMetrics | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/store/metrics`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error('[API] Error obteniendo métricas de la tienda:', err);
      return null;
    }
  },

  async fetchStoreSettings(): Promise<StoreSettings | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/store/settings`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error('[API] Error obteniendo configuraciones de la tienda:', err);
      return null;
    }
  },

  async saveStoreSettings(settings: Partial<StoreSettings>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/store/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      return response.ok;
    } catch (err) {
      console.error('[API] Error guardando configuraciones de la tienda:', err);
      return false;
    }
  },

  // BunaiStore Profile & Catalog (Backward compatibility)
  async getBunaiProfile(): Promise<BunaiProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/bunaistore/profile`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error('[BunaiStore] Error obteniendo perfil de BunaiStore:', err);
      return null;
    }
  },

  async getBunaiProducts(limit = 100): Promise<BunaiProduct[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/bunaistore/products?limit=${limit}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('[BunaiStore] Error obteniendo productos de BunaiStore:', err);
      return [];
    }
  },

  async getBunaiProductDetails(productId: string): Promise<BunaiProduct | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/bunaistore/product/${productId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error('[BunaiStore] Error obteniendo detalles del producto BunaiStore:', err);
      return null;
    }
  },

  async syncBunaiProduct(product: Partial<Product>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/bunaistore/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      return response.ok;
    } catch (err) {
      console.error('[BunaiStore] Error sincronizando producto BunaiStore:', err);
      return false;
    }
  },

  async orderBunaiProduct(productId: string, qty = 1): Promise<{ success: boolean; data?: BunaiOrderResult; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bunaistore/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty }),
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: data?.detail || data?.error || `Error HTTP ${response.status}`,
        };
      }
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de red' };
    }
  },
};
