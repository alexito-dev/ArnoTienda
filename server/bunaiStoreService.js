import https from 'https';

const BUNAISTORE_API_KEY = process.env.BUNAISTORE_API_KEY || 'Shop::2WR8PHImP8Njh3kHI6twuz2AWF8';
const BUNAISTORE_BASE_HOST = 'api.bunaistore.shop';

const makeRequest = (path, method = 'GET', body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BUNAISTORE_BASE_HOST,
      path,
      method,
      headers: {
        'X-API-Key': BUNAISTORE_API_KEY,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

export const getBunaiProfile = async () => {
  return await makeRequest('/v1/me');
};

export const getBunaiProducts = async (limit = 100) => {
  return await makeRequest(`/v1/products?limit=${limit}`);
};

export const getBunaiProductDetails = async (productId) => {
  return await makeRequest(`/v1/products/${productId}`);
};

export const createBunaiOrder = async (productId, qty = 1) => {
  return await makeRequest('/v1/orders', 'POST', {
    product_id: productId,
    qty,
  });
};
