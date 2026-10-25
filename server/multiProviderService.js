import https from 'https';
import http from 'http';
import { URL } from 'url';

// Helper to make generic HTTP/HTTPS requests
export const makeApiRequest = (targetUrl, method = 'GET', headers = {}, body = null) => {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(targetUrl);
      const isHttps = parsedUrl.protocol === 'https:';
      const client = isHttps ? https : http;

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ArnoTienda-MultiProvider/1.0',
          ...headers,
        },
        timeout: 12000,
      };

      const req = client.request(options, (res) => {
        let rawData = '';
        res.on('data', (chunk) => (rawData += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(rawData);
            resolve({ status: res.statusCode, data: parsed, raw: rawData });
          } catch {
            resolve({ status: res.statusCode, raw: rawData });
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Tiempo de espera agotado al conectar con el proveedor'));
      });

      req.on('error', (err) => reject(err));

      if (body) {
        req.write(typeof body === 'string' ? body : JSON.stringify(body));
      }
      req.end();
    } catch (err) {
      reject(err);
    }
  });
};

// Test connection for a given provider configuration
export const testProviderConnection = async (provider) => {
  try {
    if (!provider || !provider.apiBaseUrl) {
      return { success: false, error: 'URL base del proveedor no configurada' };
    }

    if (provider.type === 'bunaistore') {
      const host = provider.apiBaseUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const path = provider.apiBaseUrl.includes('/v1') ? '/v1/me' : '/me';
      const headers = { 'X-API-Key': provider.apiKey || '' };
      const url = `https://${host}${path}`;

      const res = await makeApiRequest(url, 'GET', headers);
      if (res.status === 200 && res.data) {
        return {
          success: true,
          status: 'active',
          balanceUSD: res.data.balance || 0,
          details: {
            user_id: res.data.user_id,
            display_name: res.data.display_name,
            balance: res.data.balance,
            api_orders: res.data.api_orders || 0,
          },
        };
      }
      return { success: false, status: 'error', error: res.data?.detail || `HTTP ${res.status}` };
    }

    // Generic REST Provider test ping
    const headers = {};
    if (provider.apiKey) {
      if (provider.authHeaderName) {
        headers[provider.authHeaderName] = provider.apiKey;
      } else {
        headers['Authorization'] = `Bearer ${provider.apiKey}`;
      }
    }

    const testUrl = provider.pingEndpoint
      ? `${provider.apiBaseUrl.replace(/\/+$/, '')}/${provider.pingEndpoint.replace(/^\/+/, '')}`
      : provider.apiBaseUrl;

    const res = await makeApiRequest(testUrl, 'GET', headers);
    if (res.status >= 200 && res.status < 400) {
      return {
        success: true,
        status: 'active',
        balanceUSD: provider.balanceUSD || 0,
        details: res.data || { message: 'Conexion exitosa' },
      };
    }

    return {
      success: false,
      status: 'error',
      error: `Respuesta HTTP ${res.status} del proveedor`,
    };
  } catch (err) {
    return { success: false, status: 'error', error: err.message };
  }
};

// Fetch catalog products from a provider
export const fetchProviderProducts = async (provider, limit = 100) => {
  try {
    if (provider.type === 'bunaistore') {
      const host = provider.apiBaseUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const path = provider.apiBaseUrl.includes('/v1')
        ? `/v1/products?limit=${limit}`
        : `/products?limit=${limit}`;
      const headers = { 'X-API-Key': provider.apiKey || '' };
      const url = `https://${host}${path}`;

      const res = await makeApiRequest(url, 'GET', headers);
      if (res.status === 200 && Array.isArray(res.data)) {
        return res.data.map((item) => ({
          providerProductId: item.product_id,
          name: item.name || item.display_name,
          wholesalePriceUSD: item.price || 0,
          stock: item.stock_count || 0,
          deliveryType: item.stock_type === 'auto' ? 'auto' : 'manual',
          warrantyHours: item.warranty_hours || 0,
          note: item.note || '',
          providerId: provider.id,
          providerName: provider.name,
        }));
      }
      return [];
    }

    // Custom or mock provider products endpoint
    const headers = {};
    if (provider.apiKey) {
      headers[provider.authHeaderName || 'Authorization'] = provider.apiKey.startsWith('Bearer')
        ? provider.apiKey
        : `Bearer ${provider.apiKey}`;
    }

    const productsUrl = `${provider.apiBaseUrl.replace(/\/+$/, '')}/products`;
    const res = await makeApiRequest(productsUrl, 'GET', headers);
    if (res.status === 200 && Array.isArray(res.data)) {
      return res.data.map((item, idx) => ({
        providerProductId: item.id || item.product_id || `prod_${idx}`,
        name: item.name || item.title,
        wholesalePriceUSD: item.price || item.cost || 0,
        stock: item.stock || item.quantity || 99,
        deliveryType: item.delivery_type || 'auto',
        warrantyHours: item.warranty_hours || 24,
        note: item.description || '',
        providerId: provider.id,
        providerName: provider.name,
      }));
    }

    return [];
  } catch (err) {
    console.error(`[MultiProvider] Error obteniendo catalogo de ${provider.name}:`, err.message);
    return [];
  }
};

// Fulfill order item with provider
export const fulfillOrderItemWithProvider = async (provider, productId, qty = 1) => {
  try {
    if (provider.type === 'bunaistore') {
      const host = provider.apiBaseUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const path = provider.apiBaseUrl.includes('/v1') ? '/v1/orders' : '/orders';
      const headers = { 'X-API-Key': provider.apiKey || '' };
      const url = `https://${host}${path}`;

      const res = await makeApiRequest(url, 'POST', headers, { product_id: productId, qty });
      if (res.status === 200 || res.status === 201) {
        const items = res.data?.items || [];
        const keys = Array.isArray(items) ? items : [res.data?.key || res.data?.activation_code].filter(Boolean);
        return {
          success: true,
          providerOrderId: res.data?.order_id || `BUNAI-${Date.now()}`,
          keys,
          raw: res.data,
        };
      }

      return {
        success: false,
        statusCode: res.status,
        error: res.data?.detail || res.data?.error || `HTTP ${res.status}`,
      };
    }

    // Generic provider fulfillment
    const headers = {};
    if (provider.apiKey) {
      headers[provider.authHeaderName || 'Authorization'] = provider.apiKey;
    }
    const orderUrl = `${provider.apiBaseUrl.replace(/\/+$/, '')}/orders`;
    const res = await makeApiRequest(orderUrl, 'POST', headers, { product_id: productId, quantity: qty });

    if (res.status >= 200 && res.status < 300) {
      return {
        success: true,
        providerOrderId: res.data?.order_id || `EXT-${Date.now()}`,
        keys: res.data?.keys || [res.data?.key || 'ENTREGA-EXITOSA'],
        raw: res.data,
      };
    }

    return {
      success: false,
      statusCode: res.status,
      error: res.data?.error || `HTTP ${res.status}`,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
