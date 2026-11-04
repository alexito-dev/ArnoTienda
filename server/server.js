import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { getBunaiProfile, getBunaiProducts, getBunaiProductDetails, createBunaiOrder } from './bunaiStoreService.js';
import { testProviderConnection, fetchProviderProducts, fulfillOrderItemWithProvider } from './multiProviderService.js';
import {
  connectWithRetry,
  initDatabaseSchemas,
  query,
  getOne,
  getAll,
  execute,
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3008;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initial Seed Products
const INITIAL_SEED = [
  {
    id: 'gemini-ai-pro',
    name: 'Gemini AI Pro (18 Meses)',
    subtitle: 'Cuenta Completa',
    category: 'multimodal',
    badge: 'MÁS VENDIDO',
    regionBadge: 'GLOBAL KEY',
    canActivateInCountry: 1,
    discountPercent: 50,
    originalPriceDisplay: '13.30',
    priceDisplay: '6.64',
    g2aPlusPriceDisplay: '5.90',
    yearlyPriceDisplay: '6.64',
    originalYearlyPriceDisplay: '13.30',
    priceUnit: 'USD / S/ 24.90 PEN',
    numericPrice: 6.64,
    numericYearlyPrice: 6.64,
    numericOriginalPrice: 13.30,
    sellerName: 'ArnoAI Official',
    sellerRating: 4.9,
    sellerFeedbackPercent: 99.8,
    sellerSales: 3420,
    shieldIncluded: 1,
    headerBg: 'purple',
    iconType: 'spark',
    description: 'Acceso completo a Gemini 2.0 Pro, Google Flow 1000 créditos/mes y herramientas multimodales de Google por 18 meses.',
    checklist: JSON.stringify([
      'Acceso completo a Gemini AI Pro',
      'Link de activación oficial Google One (18 meses)',
      '1000 créditos mensuales en Google Flow',
      'Documentos y fotos privadas',
      'Garantía total durante los 18 meses',
    ]),
    modelsIncluded: JSON.stringify(['Gemini 2.0 Flash', 'Gemini 1.5 Pro', 'Imagen 3', 'Google Flow']),
    specs: JSON.stringify([
      { label: 'Formato', value: 'Link de Activación (Google One)' },
      { label: 'Duración', value: '18 Meses Garantizados' },
      { label: 'Región', value: 'Global (Funciona en todos los países)' },
      { label: 'Entrega', value: 'Instantánea por Web / WhatsApp' },
    ]),
    idealFor: 'Estudiantes, creadores de contenido y profesionales que buscan IA de Google a largo plazo.',
    activationKeySample: 'G2A-GEMINI-PRO-18M-LIVE-88X92',
    imageUrl: '',
    isActive: 1,
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus (Personal Privado)',
    subtitle: 'Cuenta Privada 1m',
    category: 'ide',
    badge: 'TOP VENTAS',
    regionBadge: 'GLOBAL KEY',
    canActivateInCountry: 1,
    discountPercent: 17,
    originalPriceDisplay: '7.97',
    priceDisplay: '6.64',
    g2aPlusPriceDisplay: '5.90',
    yearlyPriceDisplay: '6.64',
    originalYearlyPriceDisplay: '7.97',
    priceUnit: 'USD / S/ 24.90 PEN',
    numericPrice: 6.64,
    numericYearlyPrice: 6.64,
    numericOriginalPrice: 7.97,
    sellerName: 'ArnoAI Official',
    sellerRating: 4.9,
    sellerFeedbackPercent: 99.8,
    sellerSales: 5120,
    shieldIncluded: 1,
    headerBg: 'dark-purple',
    iconType: 'code',
    description: 'Cuenta privada de ChatGPT Plus con GPT-4o completo, Canvas interactivo, voz avanzada y generación de imágenes DALL-E 3.',
    checklist: JSON.stringify([
      'Acceso personal privado a ChatGPT Plus',
      'GPT-4o, GPT-4o mini y razonamiento o1',
      'Generación ilimitada de imágenes con DALL-E 3',
      'Soporte técnico 24/7 y garantía total',
    ]),
    modelsIncluded: JSON.stringify(['GPT-4o', 'DALL-E 3', 'o1-preview', 'Advanced Voice']),
    specs: JSON.stringify([
      { label: 'Acceso', value: 'Cuenta Personal Privada' },
      { label: 'Duración', value: '1 Mes Renovable' },
      { label: 'Región', value: 'Global (Sin VPN)' },
    ]),
    idealFor: 'Programadores, redactores y profesionales que requieren el máximo nivel de respuesta en IA.',
    activationKeySample: 'G2A-CHATGPT-PLUS-LIVE-77192',
    imageUrl: '',
    isActive: 1,
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro (Cuenta Privada)',
    subtitle: 'Consola Anthropic',
    category: 'dev',
    badge: 'ALTA DEMANDA',
    regionBadge: 'GLOBAL KEY',
    canActivateInCountry: 1,
    discountPercent: 20,
    originalPriceDisplay: '9.97',
    priceDisplay: '7.98',
    g2aPlusPriceDisplay: '6.90',
    yearlyPriceDisplay: '7.98',
    originalYearlyPriceDisplay: '9.97',
    priceUnit: 'USD / S/ 29.90 PEN',
    numericPrice: 7.98,
    numericYearlyPrice: 7.98,
    numericOriginalPrice: 9.97,
    sellerName: 'ArnoAI Official',
    sellerRating: 4.9,
    sellerFeedbackPercent: 99.9,
    sellerSales: 2150,
    shieldIncluded: 1,
    headerBg: 'pink',
    iconType: 'hexagon',
    description: 'Acceso exclusivo a Claude 3.5 Sonnet con ventana de contexto de 200k tokens, Projects colaborativos y soporte de código avanzado.',
    checklist: JSON.stringify([
      'Cuenta personal privada para Claude Pro',
      'Acceso prioritario a Claude 3.5 Sonnet',
      'Proyectos (Projects) y carga masiva de archivos',
      'Entrega inmediata con credenciales directas',
    ]),
    modelsIncluded: JSON.stringify(['Claude 3.5 Sonnet', 'Claude 3 Opus', 'Claude 3 Haiku']),
    specs: JSON.stringify([
      { label: 'Formato', value: 'Correo + Clave Privada' },
      { label: 'Duración', value: '30 Días Garantizados' },
      { label: 'Contexto', value: '200K Tokens' },
    ]),
    idealFor: 'Desarrolladores de software, investigadores y analistas de datos.',
    activationKeySample: 'G2A-CLAUDE-PRO-KEY-99412',
    imageUrl: '',
    isActive: 1,
  },
  {
    id: 'claude-api-250',
    name: 'API Plan $250 USD (Claude API)',
    subtitle: 'Consola Anthropic',
    category: 'dev',
    badge: 'OFERTA API',
    regionBadge: 'GLOBAL KEY',
    canActivateInCountry: 1,
    discountPercent: 40,
    originalPriceDisplay: '19.98',
    priceDisplay: '11.97',
    g2aPlusPriceDisplay: '10.50',
    yearlyPriceDisplay: '11.97',
    originalYearlyPriceDisplay: '19.98',
    priceUnit: 'USD / S/ 44.90 PEN',
    numericPrice: 11.97,
    numericYearlyPrice: 11.97,
    numericOriginalPrice: 19.98,
    sellerName: 'ArnoAI Official',
    sellerRating: 4.9,
    sellerFeedbackPercent: 99.6,
    sellerSales: 1450,
    shieldIncluded: 1,
    headerBg: 'charcoal',
    iconType: 'zap',
    description: 'Saldo oficial de $250 USD para llamadas a la API de Anthropic Console. Ideal para desplegar agentes y pipelines de desarrollo.',
    checklist: JSON.stringify([
      '$250 USD de saldo en Anthropic Console API',
      'Acceso completo a Claude 3.5 Sonnet y Opus',
      'Llave API oficial para desarrolladores',
      'Garantía total de uso en producción',
    ]),
    modelsIncluded: JSON.stringify(['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus']),
    specs: JSON.stringify([
      { label: 'Saldo API', value: '$250.00 USD' },
      { label: 'Proveedor', value: 'Anthropic Console' },
      { label: 'Entrega', value: 'API Key Oficial / Credenciales' },
    ]),
    idealFor: 'Desarrolladores con volumen medio y startups en crecimiento.',
    activationKeySample: 'sk-ant-api03-ARNO-250USD-LIVE-7721',
    imageUrl: '',
    isActive: 1,
  },
  {
    id: 'claude-api-500',
    name: 'API Plan $500 USD (Claude API)',
    subtitle: 'Consola Anthropic',
    category: 'dev',
    badge: 'RECOMENDADO',
    regionBadge: 'GLOBAL KEY',
    canActivateInCountry: 1,
    discountPercent: 35,
    originalPriceDisplay: '26.64',
    priceDisplay: '17.30',
    g2aPlusPriceDisplay: '15.90',
    yearlyPriceDisplay: '17.30',
    originalYearlyPriceDisplay: '26.64',
    priceUnit: 'USD / S/ 64.90 PEN',
    numericPrice: 17.30,
    numericYearlyPrice: 17.30,
    numericOriginalPrice: 26.64,
    sellerName: 'ArnoAI Official',
    sellerRating: 5.0,
    sellerFeedbackPercent: 100.0,
    sellerSales: 980,
    shieldIncluded: 1,
    headerBg: 'slate',
    iconType: 'spark',
    description: 'Crédito masivo de $500 USD para Anthropic Console API. Alto rendimiento garantizado para producción.',
    checklist: JSON.stringify([
      '$500 USD de saldo en Anthropic Console API',
      'Acceso completo sin límites de velocidad',
      'Llave API oficial para producción',
      'Garantía total de disponibilidad 30 días',
    ]),
    modelsIncluded: JSON.stringify(['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus']),
    specs: JSON.stringify([
      { label: 'Saldo API', value: '$500.00 USD' },
      { label: 'Proveedor', value: 'Anthropic Console' },
      { label: 'Entrega', value: 'API Key Oficial / Credenciales' },
    ]),
    idealFor: 'Empresas, agencias y automatizaciones con agentes de IA.',
    activationKeySample: 'sk-ant-api03-ARNO-500USD-LIVE-9932',
    imageUrl: '',
    isActive: 1,
  },
];

// Helper to format PostgreSQL row to Frontend Product object
const formatRowToProduct = (row) => ({
  id: row.id,
  name: row.name,
  subtitle: row.subtitle,
  category: row.category,
  badge: row.badge,
  regionBadge: row.regionbadge || row.regionBadge,
  canActivateInCountry: Boolean(row.canactivateincountry ?? row.canActivateInCountry),
  discountPercent: Number(row.discountpercent ?? row.discountPercent ?? 0),
  originalPriceDisplay: row.originalpricedisplay || row.originalPriceDisplay,
  priceDisplay: row.pricedisplay || row.priceDisplay,
  g2aPlusPriceDisplay: row.g2apluspricedisplay || row.g2aPlusPriceDisplay,
  yearlyPriceDisplay: row.yearlypricedisplay || row.yearlyPriceDisplay,
  originalYearlyPriceDisplay: row.originalyearlypricedisplay || row.originalYearlyPriceDisplay,
  priceUnit: row.priceunit || row.priceUnit,
  numericPrice: Number(row.numericprice ?? row.numericPrice ?? 0),
  numericYearlyPrice: Number(row.numericyearlyprice ?? row.numericYearlyPrice ?? 0),
  numericOriginalPrice: row.numericoriginalprice !== null && row.numericoriginalprice !== undefined ? Number(row.numericoriginalprice) : undefined,
  sellerName: row.sellername || row.sellerName || 'ArnoAI Official',
  sellerRating: Number(row.sellerrating ?? row.sellerRating ?? 4.9),
  sellerFeedbackPercent: Number(row.sellerfeedbackpercent ?? row.sellerFeedbackPercent ?? 99.8),
  sellerSales: Number(row.sellersales ?? row.sellerSales ?? 3420),
  shieldIncluded: Boolean(row.shieldincluded ?? row.shieldIncluded),
  headerBg: row.headerbg || row.headerBg || 'purple',
  iconType: row.icontype || row.iconType || 'spark',
  description: row.description,
  checklist: typeof row.checklist === 'string' ? JSON.parse(row.checklist) : (row.checklist || []),
  modelsIncluded: typeof row.modelsincluded === 'string' ? JSON.parse(row.modelsincluded) : (row.modelsIncluded || []),
  specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : (row.specs || []),
  idealFor: row.idealfor || row.idealFor,
  activationKeySample: row.activationkeysample || row.activationKeySample,
  imageUrl: row.imageurl || row.imageUrl,
  isActive: Boolean(row.isactive ?? row.isActive),
  bunaiProductId: row.bunaiproductid || row.bunaiProductId || undefined,
  bunaiStock: row.bunaistock !== undefined ? Number(row.bunaistock) : undefined,
  wholesalePriceUSD: row.wholesalepriceusd !== undefined ? Number(row.wholesalepriceusd) : undefined,
  providerId: row.providerid || row.providerId || (row.bunaiproductid ? 'bunaistore' : 'local'),
  providerName: row.providername || row.providerName || (row.bunaiproductid ? 'BunaiStore' : 'ArnoAI Direct'),
  providerProductId: row.providerproductid || row.providerProductId || row.bunaiproductid || undefined,
  updatedAt: row.updatedat || row.updatedAt,
});

// Database Initialization & Seeding Routine
async function initializeDatabase() {
  try {
    await connectWithRetry(12, 2500);
    await initDatabaseSchemas();

    // Check & Seed Providers
    const provCountRow = await getOne('SELECT COUNT(*) as count FROM providers');
    const provCount = parseInt(provCountRow?.count || 0, 10);
    if (provCount === 0) {
      console.log('[PostgreSQL] Inicializando proveedores por defecto...');
      const defaultProviders = [
        [
          'bunaistore',
          'BunaiStore Wholesale',
          'bunaistore',
          'https://api.bunaistore.shop/v1',
          process.env.BUNAISTORE_API_KEY || 'Shop::2WR8PHImP8Njh3kHI6twuz2AWF8',
          '',
          'X-API-Key',
          'me',
          0.099,
          'active',
          1,
          3.5,
          'Proveedor principal de licencias IA y suscripciones digitales'
        ],
        [
          'g2a',
          'G2A Direct Business API',
          'g2a',
          'https://api.g2a.com/v1',
          '',
          '',
          'Authorization',
          'status',
          0.0,
          'inactive',
          0,
          2.5,
          'Catálogo global de software y claves oficiales'
        ],
        [
          'kinguin',
          'Kinguin Reseller Gateway',
          'kinguin',
          'https://gateway.kinguin.net/esa/api/v1',
          '',
          '',
          'X-Api-Key',
          'products',
          0.0,
          'inactive',
          0,
          2.5,
          'Distribuidor europeo de licencias'
        ],
        [
          'custom_api',
          'API Mayorista Externa',
          'custom',
          'https://api.example.com/v1',
          '',
          '',
          'Authorization',
          'health',
          0.0,
          'inactive',
          1,
          3.0,
          'Conector genérico REST para proveedores adicionales'
        ]
      ];

      for (const prov of defaultProviders) {
        await execute(`
          INSERT INTO providers (id, name, type, apiBaseUrl, apiKey, apiSecret, authHeaderName, pingEndpoint, balanceUSD, status, autoFulfill, marginMultiplier, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO NOTHING
        `, prov);
      }
    }

    // Check & Seed Initial Products
    const prodCountRow = await getOne('SELECT COUNT(*) as count FROM products');
    const prodCount = parseInt(prodCountRow?.count || 0, 10);
    if (prodCount === 0) {
      console.log('[PostgreSQL] Poblando base de datos con catálogo inicial...');
      for (const p of INITIAL_SEED) {
        await execute(`
          INSERT INTO products (
            id, name, subtitle, category, badge, regionBadge, canActivateInCountry,
            discountPercent, originalPriceDisplay, priceDisplay, g2aPlusPriceDisplay,
            yearlyPriceDisplay, originalYearlyPriceDisplay, priceUnit, numericPrice,
            numericYearlyPrice, numericOriginalPrice, sellerName, sellerRating,
            sellerFeedbackPercent, sellerSales, shieldIncluded, headerBg, iconType,
            description, checklist, modelsIncluded, specs, idealFor, activationKeySample, imageUrl, isActive
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO NOTHING
        `, [
          p.id, p.name, p.subtitle, p.category, p.badge, p.regionBadge, p.canActivateInCountry,
          p.discountPercent, p.originalPriceDisplay, p.priceDisplay, p.g2aPlusPriceDisplay,
          p.yearlyPriceDisplay, p.originalYearlyPriceDisplay, p.priceUnit, p.numericPrice,
          p.numericYearlyPrice, p.numericOriginalPrice, p.sellerName, p.sellerRating,
          p.sellerFeedbackPercent, p.sellerSales, p.shieldIncluded, p.headerBg, p.iconType,
          p.description, p.checklist, p.modelsIncluded, p.specs, p.idealFor, p.activationKeySample, p.imageUrl, p.isActive
        ]);
      }
    }

    // Check & Seed Store Settings
    const defaultSettings = [
      ['exchangeRatePEN', '3.75'],
      ['storeName', 'ArnoTienda'],
      ['defaultMarginMultiplier', '3.0'],
      ['autoFulfill', '1']
    ];
    for (const [key, val] of defaultSettings) {
      await execute(`
        INSERT INTO store_settings (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO NOTHING
      `, [key, val]);
    }

    // Check & Seed Sample Orders if empty
    const orderCountRow = await getOne('SELECT COUNT(*) as count FROM orders');
    const orderCount = parseInt(orderCountRow?.count || 0, 10);
    if (orderCount === 0) {
      const sampleItems1 = JSON.stringify([{
        productId: 'claude-api-500',
        productName: 'API Plan $500 USD (Claude API)',
        quantity: 1,
        pricePEN: 64.90,
        activationKey: 'sk-ant-api03-ARNO-500USD-LIVE-8812',
        providerId: 'bunaistore',
        providerStatus: 'entregado'
      }]);
      await execute(`
        INSERT INTO orders (id, customerName, customerEmail, customerPhone, paymentMethod, totalPEN, status, fulfillmentStatus, items, notes)
        VALUES (?, ?, ?, ?, ?, ?, 'completado', 'entregado', ?, ?)
        ON CONFLICT(id) DO NOTHING
      `, ['ORD-771291', 'Alex C.', 'contacto@arno.services', '+51 987654321', 'Yape / Plin', 64.90, sampleItems1, 'Entrega automática exitosa']);
    }

    console.log('[PostgreSQL] Inicialización de base de datos completada.');
  } catch (err) {
    console.error('[PostgreSQL] Error crítico inicializando base de datos:', err.message);
  }
}

// ----------------------------------------------------
// API Routes
// ----------------------------------------------------

// GET /api/products - Get all products from PostgreSQL DB
app.get('/api/products', async (req, res) => {
  try {
    const rows = await getAll('SELECT * FROM products ORDER BY updatedAt DESC');
    res.json(rows.map(formatRowToProduct));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products - Insert or Update product in PostgreSQL DB
app.post('/api/products', async (req, res) => {
  const p = req.body;
  if (!p.id || !p.name) {
    res.status(400).json({ error: 'Faltan campos obligatorios id y name' });
    return;
  }

  const querySql = `
    INSERT INTO products (
      id, name, subtitle, category, badge, regionBadge, canActivateInCountry,
      discountPercent, originalPriceDisplay, priceDisplay, g2aPlusPriceDisplay,
      yearlyPriceDisplay, originalYearlyPriceDisplay, priceUnit, numericPrice,
      numericYearlyPrice, numericOriginalPrice, sellerName, sellerRating,
      sellerFeedbackPercent, sellerSales, shieldIncluded, headerBg, iconType,
      description, checklist, modelsIncluded, specs, idealFor, activationKeySample, imageUrl, isActive, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      subtitle=excluded.subtitle,
      category=excluded.category,
      badge=excluded.badge,
      regionBadge=excluded.regionBadge,
      canActivateInCountry=excluded.canActivateInCountry,
      discountPercent=excluded.discountPercent,
      originalPriceDisplay=excluded.originalPriceDisplay,
      priceDisplay=excluded.priceDisplay,
      g2aPlusPriceDisplay=excluded.g2aPlusPriceDisplay,
      yearlyPriceDisplay=excluded.yearlyPriceDisplay,
      originalYearlyPriceDisplay=excluded.originalYearlyPriceDisplay,
      priceUnit=excluded.priceUnit,
      numericPrice=excluded.numericPrice,
      numericYearlyPrice=excluded.numericYearlyPrice,
      numericOriginalPrice=excluded.numericOriginalPrice,
      headerBg=excluded.headerBg,
      iconType=excluded.iconType,
      description=excluded.description,
      checklist=excluded.checklist,
      modelsIncluded=excluded.modelsIncluded,
      specs=excluded.specs,
      idealFor=excluded.idealFor,
      imageUrl=excluded.imageUrl,
      isActive=excluded.isActive,
      updatedAt=CURRENT_TIMESTAMP
  `;

  try {
    await execute(querySql, [
      p.id, p.name, p.subtitle || 'Licencia Digital', p.category || 'multimodal', p.badge || 'OFERTA',
      p.regionBadge || 'GLOBAL KEY', p.canActivateInCountry ? 1 : 0, p.discountPercent || 0,
      p.originalPriceDisplay || '', p.priceDisplay || '0.00', p.g2aPlusPriceDisplay || '',
      p.yearlyPriceDisplay || p.priceDisplay, p.originalYearlyPriceDisplay || p.originalPriceDisplay,
      p.priceUnit || '', p.numericPrice || 0, p.numericYearlyPrice || p.numericPrice || 0,
      p.numericOriginalPrice || 0, p.sellerName || 'ArnoAI Official', p.sellerRating || 4.9,
      p.sellerFeedbackPercent || 99.8, p.sellerSales || 3420, p.shieldIncluded ? 1 : 0,
      p.headerBg || 'purple', p.iconType || 'spark', p.description || '',
      JSON.stringify(p.checklist || []), JSON.stringify(p.modelsIncluded || []),
      JSON.stringify(p.specs || []), p.idealFor || '', p.activationKeySample || '',
      p.imageUrl || '', p.isActive !== false ? 1 : 0
    ]);
    res.json({ success: true, message: 'Producto guardado en PostgreSQL', id: p.id });
  } catch (err) {
    console.error('[PostgreSQL] Error guardando producto:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id - Delete product from PostgreSQL DB
app.delete('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Producto eliminado de PostgreSQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/reset - Reset PostgreSQL DB to initial seed
app.post('/api/products/reset', async (req, res) => {
  try {
    await execute('DELETE FROM products');
    for (const p of INITIAL_SEED) {
      await execute(`
        INSERT INTO products (
          id, name, subtitle, category, badge, regionBadge, canActivateInCountry,
          discountPercent, originalPriceDisplay, priceDisplay, g2aPlusPriceDisplay,
          yearlyPriceDisplay, originalYearlyPriceDisplay, priceUnit, numericPrice,
          numericYearlyPrice, numericOriginalPrice, sellerName, sellerRating,
          sellerFeedbackPercent, sellerSales, shieldIncluded, headerBg, iconType,
          description, checklist, modelsIncluded, specs, idealFor, activationKeySample, imageUrl, isActive
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.id, p.name, p.subtitle, p.category, p.badge, p.regionBadge, p.canActivateInCountry,
        p.discountPercent, p.originalPriceDisplay, p.priceDisplay, p.g2aPlusPriceDisplay,
        p.yearlyPriceDisplay, p.originalYearlyPriceDisplay, p.priceUnit, p.numericPrice,
        p.numericYearlyPrice, p.numericOriginalPrice, p.sellerName, p.sellerRating,
        p.sellerFeedbackPercent, p.sellerSales, p.shieldIncluded, p.headerBg, p.iconType,
        p.description, p.checklist, p.modelsIncluded, p.specs, p.idealFor, p.activationKeySample, p.imageUrl, p.isActive
      ]);
    }
    res.json({ success: true, message: 'Base de datos PostgreSQL restablecida' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bunaistore/profile - BunaiStore account & balance
app.get('/api/bunaistore/profile', async (req, res) => {
  try {
    const result = await getBunaiProfile();
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bunaistore/products - BunaiStore live catalog
app.get('/api/bunaistore/products', async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const result = await getBunaiProducts(limit);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bunaistore/product/:id - BunaiStore product details
app.get('/api/bunaistore/product/:id', async (req, res) => {
  try {
    const result = await getBunaiProductDetails(req.params.id);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bunaistore/sync - Sync a BunaiStore product into store products
app.post('/api/bunaistore/sync', async (req, res) => {
  const p = req.body;
  if (!p.id || !p.name) {
    res.status(400).json({ error: 'Faltan campos id o name' });
    return;
  }

  const querySql = `
    INSERT INTO products (
      id, name, subtitle, category, badge, regionBadge, canActivateInCountry,
      discountPercent, originalPriceDisplay, priceDisplay, g2aPlusPriceDisplay,
      yearlyPriceDisplay, originalYearlyPriceDisplay, priceUnit, numericPrice,
      numericYearlyPrice, numericOriginalPrice, sellerName, sellerRating,
      sellerFeedbackPercent, sellerSales, shieldIncluded, headerBg, iconType,
      description, checklist, modelsIncluded, specs, idealFor, activationKeySample, imageUrl, isActive,
      bunaiProductId, bunaiStock, wholesalePriceUSD, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      subtitle=excluded.subtitle,
      category=excluded.category,
      badge=excluded.badge,
      regionBadge=excluded.regionBadge,
      discountPercent=excluded.discountPercent,
      priceDisplay=excluded.priceDisplay,
      numericPrice=excluded.numericPrice,
      numericYearlyPrice=excluded.numericYearlyPrice,
      priceUnit=excluded.priceUnit,
      description=excluded.description,
      checklist=excluded.checklist,
      specs=excluded.specs,
      isActive=excluded.isActive,
      bunaiProductId=excluded.bunaiProductId,
      bunaiStock=excluded.bunaiStock,
      wholesalePriceUSD=excluded.wholesalePriceUSD,
      updatedAt=CURRENT_TIMESTAMP
  `;

  try {
    await execute(querySql, [
      p.id, p.name, p.subtitle || 'Entrega Inmediata API', p.category || 'multimodal', p.badge || 'BUNAISTORE',
      p.regionBadge || 'GLOBAL KEY', 1, p.discountPercent || 0,
      p.originalPriceDisplay || '', p.priceDisplay || '0.00', p.g2aPlusPriceDisplay || '',
      p.priceDisplay, p.originalPriceDisplay || '',
      p.priceUnit || '', p.numericPrice || 0, p.numericPrice || 0,
      p.numericOriginalPrice || 0, 'BunaiStore Verified', 5.0,
      100.0, 999, 1,
      p.headerBg || 'dark-purple', p.iconType || 'zap', p.description || '',
      JSON.stringify(p.checklist || ['Entrega inmediata garantizada', 'Soporte 24/7', 'Clave o cuenta oficial']),
      JSON.stringify(p.modelsIncluded || []),
      JSON.stringify(p.specs || [{ label: 'Proveedor', value: 'BunaiStore API' }, { label: 'Garantía', value: `${p.warrantyHours || 24} Horas` }]),
      p.idealFor || '', p.activationKeySample || 'BUNAI-AUTO-DELIVERY',
      p.imageUrl || '', 1,
      p.bunaiProductId || p.id, p.bunaiStock || 0, p.wholesalePriceUSD || 0
    ]);
    res.json({ success: true, message: 'Producto BunaiStore sincronizado exitosamente en la tienda', id: p.id });
  } catch (err) {
    console.error('[BunaiStore] Error sincronizando producto BunaiStore:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bunaistore/order - Create BunaiStore order
app.post('/api/bunaistore/order', async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId) {
      res.status(400).json({ error: 'Falta productId' });
      return;
    }
    const result = await createBunaiOrder(productId, qty || 1);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multi-Providers API Routes
// GET /api/providers - List all providers
app.get('/api/providers', async (req, res) => {
  try {
    const rows = await getAll('SELECT * FROM providers ORDER BY createdAt ASC');
    const countRows = await getAll('SELECT providerId, COUNT(*) as count FROM products GROUP BY providerId');
    const countMap = {};
    (countRows || []).forEach((c) => {
      const pid = c.providerid || c.providerId;
      countMap[pid] = parseInt(c.count, 10);
    });

    const formatted = rows.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      apiBaseUrl: r.apibaseurl || r.apiBaseUrl,
      apiKey: r.apikey || r.apiKey,
      apiSecret: r.apisecret || r.apiSecret,
      authHeaderName: r.authheadername || r.authHeaderName,
      pingEndpoint: r.pingendpoint || r.pingEndpoint,
      balanceUSD: Number(r.balanceusd ?? r.balanceUSD ?? 0),
      status: r.status,
      autoFulfill: Boolean(r.autofulfill ?? r.autoFulfill),
      marginMultiplier: Number(r.marginmultiplier ?? r.marginMultiplier ?? 3.0),
      notes: r.notes,
      productCount: countMap[r.id] || (r.id === 'bunaistore' ? countMap['bunaistore'] || 14 : 0),
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/providers - Create or Update a provider
app.post('/api/providers', async (req, res) => {
  const p = req.body;
  if (!p.id || !p.name || !p.apiBaseUrl) {
    res.status(400).json({ error: 'Faltan campos obligatorios: id, name o apiBaseUrl' });
    return;
  }

  const querySql = `
    INSERT INTO providers (id, name, type, apiBaseUrl, apiKey, apiSecret, authHeaderName, pingEndpoint, balanceUSD, status, autoFulfill, marginMultiplier, notes, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      type=excluded.type,
      apiBaseUrl=excluded.apiBaseUrl,
      apiKey=excluded.apiKey,
      apiSecret=excluded.apiSecret,
      authHeaderName=excluded.authHeaderName,
      pingEndpoint=excluded.pingEndpoint,
      balanceUSD=excluded.balanceUSD,
      status=excluded.status,
      autoFulfill=excluded.autoFulfill,
      marginMultiplier=excluded.marginMultiplier,
      notes=excluded.notes,
      updatedAt=CURRENT_TIMESTAMP
  `;

  try {
    await execute(querySql, [
      p.id,
      p.name,
      p.type || 'custom',
      p.apiBaseUrl,
      p.apiKey || '',
      p.apiSecret || '',
      p.authHeaderName || 'X-API-Key',
      p.pingEndpoint || '',
      p.balanceUSD || 0,
      p.status || 'active',
      p.autoFulfill ? 1 : 0,
      p.marginMultiplier || 3.0,
      p.notes || ''
    ]);
    res.json({ success: true, message: 'Proveedor configurado exitosamente', id: p.id });
  } catch (err) {
    console.error('[MultiProvider] Error guardando proveedor:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/providers/:id - Delete a provider
app.delete('/api/providers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await execute('DELETE FROM providers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Proveedor eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/providers/:id/test - Test connection & live balance
app.post('/api/providers/:id/test', async (req, res) => {
  const id = req.params.id;
  try {
    const row = await getOne('SELECT * FROM providers WHERE id = ?', [id]);
    if (!row) {
      res.status(404).json({ error: 'Proveedor no encontrado' });
      return;
    }

    const providerObj = {
      id: row.id,
      name: row.name,
      type: row.type,
      apiBaseUrl: row.apibaseurl || row.apiBaseUrl,
      apiKey: row.apikey || row.apiKey,
      apiSecret: row.apisecret || row.apiSecret,
      authHeaderName: row.authheadername || row.authHeaderName,
      pingEndpoint: row.pingendpoint || row.pingEndpoint,
      balanceUSD: Number(row.balanceusd ?? row.balanceUSD ?? 0),
    };

    const testResult = await testProviderConnection(providerObj);
    if (testResult.success) {
      const balance = testResult.balanceUSD !== undefined ? testResult.balanceUSD : providerObj.balanceUSD;
      await execute('UPDATE providers SET balanceUSD = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [
        balance,
        'active',
        id,
      ]);
    } else {
      await execute('UPDATE providers SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [
        'error',
        id,
      ]);
    }
    res.json(testResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/providers/:id/products - Fetch live catalog from a provider
app.get('/api/providers/:id/products', async (req, res) => {
  const id = req.params.id;
  try {
    const row = await getOne('SELECT * FROM providers WHERE id = ?', [id]);
    if (!row) {
      res.status(404).json({ error: 'Proveedor no encontrado' });
      return;
    }

    const providerObj = {
      id: row.id,
      name: row.name,
      type: row.type,
      apiBaseUrl: row.apibaseurl || row.apiBaseUrl,
      apiKey: row.apikey || row.apiKey,
      apiSecret: row.apisecret || row.apiSecret,
      authHeaderName: row.authheadername || row.authHeaderName,
      pingEndpoint: row.pingendpoint || row.pingEndpoint,
    };

    const limit = parseInt(req.query.limit, 10) || 100;
    const prods = await fetchProviderProducts(providerObj, limit);
    res.json(prods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/providers/sync-product - Universal product sync from any provider
app.post('/api/providers/sync-product', async (req, res) => {
  const p = req.body;
  if (!p.id || !p.name) {
    res.status(400).json({ error: 'Faltan campos id o name' });
    return;
  }

  const querySql = `
    INSERT INTO products (
      id, name, subtitle, category, badge, regionBadge, canActivateInCountry,
      discountPercent, originalPriceDisplay, priceDisplay, g2aPlusPriceDisplay,
      yearlyPriceDisplay, originalYearlyPriceDisplay, priceUnit, numericPrice,
      numericYearlyPrice, numericOriginalPrice, sellerName, sellerRating,
      sellerFeedbackPercent, sellerSales, shieldIncluded, headerBg, iconType,
      description, checklist, modelsIncluded, specs, idealFor, activationKeySample, imageUrl, isActive,
      providerId, providerName, providerProductId, bunaiProductId, bunaiStock, wholesalePriceUSD, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      subtitle=excluded.subtitle,
      category=excluded.category,
      badge=excluded.badge,
      regionBadge=excluded.regionBadge,
      discountPercent=excluded.discountPercent,
      priceDisplay=excluded.priceDisplay,
      numericPrice=excluded.numericPrice,
      numericYearlyPrice=excluded.numericYearlyPrice,
      priceUnit=excluded.priceUnit,
      description=excluded.description,
      checklist=excluded.checklist,
      specs=excluded.specs,
      isActive=excluded.isActive,
      providerId=excluded.providerId,
      providerName=excluded.providerName,
      providerProductId=excluded.providerProductId,
      bunaiProductId=excluded.bunaiProductId,
      bunaiStock=excluded.bunaiStock,
      wholesalePriceUSD=excluded.wholesalePriceUSD,
      updatedAt=CURRENT_TIMESTAMP
  `;

  try {
    await execute(querySql, [
      p.id,
      p.name,
      p.subtitle || 'Licencia Digital Oficial',
      p.category || 'multimodal',
      p.badge || 'PROVEEDOR VERIFICADO',
      p.regionBadge || 'GLOBAL KEY',
      1,
      p.discountPercent || 0,
      p.originalPriceDisplay || '',
      p.priceDisplay || '0.00',
      p.g2aPlusPriceDisplay || '',
      p.priceDisplay,
      p.originalPriceDisplay || '',
      p.priceUnit || '',
      p.numericPrice || 0,
      p.numericPrice || 0,
      p.numericOriginalPrice || 0,
      p.providerName || 'Proveedor Verificado',
      5.0,
      100.0,
      999,
      1,
      p.headerBg || 'dark-purple',
      p.iconType || 'zap',
      p.description || '',
      JSON.stringify(p.checklist || ['Entrega automatica garantizada', 'Soporte 24/7 oficial', 'Activacion verificada']),
      JSON.stringify(p.modelsIncluded || []),
      JSON.stringify(p.specs || [{ label: 'Proveedor', value: p.providerName || 'API Externa' }, { label: 'Garantia', value: '24 Horas Reposicion' }]),
      p.idealFor || '',
      p.activationKeySample || 'ARNO-AUTO-DISPATCH-KEY',
      p.imageUrl || '',
      1,
      p.providerId || 'custom',
      p.providerName || 'Proveedor Externo',
      p.providerProductId || p.bunaiProductId || p.id,
      p.bunaiProductId || p.providerProductId || p.id,
      p.stock || p.bunaiStock || 99,
      p.wholesalePriceUSD || 0
    ]);
    res.json({ success: true, message: 'Producto sincronizado exitosamente en el catalogo de la tienda', id: p.id });
  } catch (err) {
    console.error('[MultiProvider] Error sincronizando producto:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Orders Management Endpoints
// GET /api/orders - List all customer orders
app.get('/api/orders', async (req, res) => {
  try {
    const rows = await getAll('SELECT * FROM orders ORDER BY createdAt DESC');
    const formatted = rows.map((r) => ({
      id: r.id,
      customerName: r.customername || r.customerName,
      customerEmail: r.customeremail || r.customerEmail,
      customerPhone: r.customerphone || r.customerPhone,
      paymentMethod: r.paymentmethod || r.paymentMethod,
      totalPEN: Number(r.totalpen ?? r.totalPEN ?? 0),
      status: r.status,
      fulfillmentStatus: r.fulfillmentstatus || r.fulfillmentStatus,
      items: r.items ? (typeof r.items === 'string' ? JSON.parse(r.items) : r.items) : [],
      notes: r.notes,
      createdAt: r.createdat || r.createdAt,
      updatedAt: r.updatedat || r.updatedAt,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders - Create or record an order from store checkout
app.post('/api/orders', async (req, res) => {
  const { id, customerName, customerEmail, customerPhone, paymentMethod, totalPEN, items, notes } = req.body;
  if (!id || !items) {
    res.status(400).json({ error: 'Faltan campos id o items' });
    return;
  }

  const itemsJson = typeof items === 'string' ? items : JSON.stringify(items);
  const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

  const querySql = `
    INSERT INTO orders (id, customerName, customerEmail, customerPhone, paymentMethod, totalPEN, status, fulfillmentStatus, items, notes, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, 'completado', 'entregado', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      customerName=excluded.customerName,
      customerEmail=excluded.customerEmail,
      customerPhone=excluded.customerPhone,
      paymentMethod=excluded.paymentMethod,
      totalPEN=excluded.totalPEN,
      items=excluded.items,
      notes=excluded.notes,
      updatedAt=CURRENT_TIMESTAMP
  `;

  try {
    await execute(querySql, [
      id,
      customerName || 'Cliente ArnoTienda',
      customerEmail || '',
      customerPhone || '',
      paymentMethod || 'Yape / Plin',
      totalPEN || 0,
      itemsJson,
      notes || 'Orden registrada desde pasarela de compra'
    ]);

    // Check if any item belongs to an active auto-fulfill provider
    try {
      const providers = await getAll('SELECT * FROM providers WHERE autoFulfill = 1');
      if (providers && providers.length > 0) {
        for (const item of parsedItems) {
          const prov = providers.find((p) => p.id === item.providerId) || providers.find((p) => p.id === 'bunaistore');
          if (prov && item.providerProductId) {
            fulfillOrderItemWithProvider(prov, item.providerProductId, item.quantity || 1)
              .then((dispatchRes) => {
                if (dispatchRes.success && dispatchRes.keys?.length > 0) {
                  console.log(`[AutoFulfill] Pedido ${id} despachado exitosamente con ${prov.name}`);
                }
              })
              .catch((e) => console.warn('[AutoFulfill] Despacho pendiente de saldo:', e.message));
          }
        }
      }
    } catch {}

    res.json({ success: true, message: 'Pedido guardado en la base de datos', orderId: id });
  } catch (err) {
    console.error('[Orders] Error guardando pedido:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id - Update order status or details
app.patch('/api/orders/:id', async (req, res) => {
  const { status, fulfillmentStatus, items, notes } = req.body;
  const orderId = req.params.id;

  const updates = [];
  const params = [];

  if (status) {
    updates.push('status = ?');
    params.push(status);
  }
  if (fulfillmentStatus) {
    updates.push('fulfillmentStatus = ?');
    params.push(fulfillmentStatus);
  }
  if (items) {
    updates.push('items = ?');
    params.push(typeof items === 'string' ? items : JSON.stringify(items));
  }
  if (notes !== undefined) {
    updates.push('notes = ?');
    params.push(notes);
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'No hay campos para actualizar' });
    return;
  }

  updates.push('updatedAt = CURRENT_TIMESTAMP');
  params.push(orderId);

  const querySql = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
  try {
    await execute(querySql, params);
    res.json({ success: true, message: 'Pedido actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/:id/dispatch - Manually re-trigger fulfillment with provider API
app.post('/api/orders/:id/dispatch', async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await getOne('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    const items = order.items ? (typeof order.items === 'string' ? JSON.parse(order.items) : order.items) : [];
    const firstItem = items[0];
    if (!firstItem) {
      res.status(400).json({ error: 'El pedido no tiene items' });
      return;
    }

    const providerId = firstItem.providerId || 'bunaistore';
    const prov = await getOne('SELECT * FROM providers WHERE id = ?', [providerId]);
    if (!prov) {
      res.status(400).json({ error: `Proveedor ${providerId} no configurado` });
      return;
    }

    const providerObj = {
      id: prov.id,
      name: prov.name,
      type: prov.type,
      apiBaseUrl: prov.apibaseurl || prov.apiBaseUrl,
      apiKey: prov.apikey || prov.apiKey,
      apiSecret: prov.apisecret || prov.apiSecret,
      authHeaderName: prov.authheadername || prov.authHeaderName,
      pingEndpoint: prov.pingendpoint || prov.pingEndpoint,
    };

    const prodId = firstItem.providerProductId || firstItem.productId?.replace('bunai-', '');
    const fulfillRes = await fulfillOrderItemWithProvider(providerObj, prodId, firstItem.quantity || 1);

    if (fulfillRes.success && fulfillRes.keys?.length > 0) {
      firstItem.activationKey = fulfillRes.keys[0];
      firstItem.providerStatus = 'entregado';
      await execute('UPDATE orders SET fulfillmentStatus = ?, items = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [
        'entregado',
        JSON.stringify(items),
        orderId,
      ]);
      res.json({ success: true, message: 'Despacho completado con proveedor', keys: fulfillRes.keys });
    } else {
      res.status(400).json({
        success: false,
        error: fulfillRes.error || 'Error al conectar con la API del proveedor (verifique saldo disponible)',
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Store Metrics & Settings
// GET /api/store/metrics - Real-time financial dashboard & sales
app.get('/api/store/metrics', async (req, res) => {
  try {
    const ordersRows = await getAll('SELECT * FROM orders');
    const prodRows = await getAll('SELECT * FROM products WHERE isActive = 1');
    const provRows = await getAll('SELECT * FROM providers');

    const totalOrders = (ordersRows || []).length;
    const totalSalesPEN = (ordersRows || []).reduce((acc, o) => acc + Number(o.totalpen ?? o.totalPEN ?? 0), 0);

    let estimatedCostPEN = 0;
    (ordersRows || []).forEach((o) => {
      try {
        const items = o.items ? (typeof o.items === 'string' ? JSON.parse(o.items) : o.items) : [];
        items.forEach((it) => {
          const prod = (prodRows || []).find((p) => p.id === it.productId || p.name === it.productName);
          const costUSD = prod ? Number(prod.wholesalepriceusd ?? prod.wholesalePriceUSD ?? 0) : 0;
          estimatedCostPEN += costUSD * 3.75 * (it.quantity || 1);
        });
      } catch {}
    });

    const netProfitPEN = Math.max(0, totalSalesPEN - estimatedCostPEN);
    const marginPercent = totalSalesPEN > 0 ? Math.round((netProfitPEN / totalSalesPEN) * 100) : 0;

    res.json({
      totalOrders,
      totalSalesPEN: Math.round(totalSalesPEN * 10) / 10,
      estimatedCostPEN: Math.round(estimatedCostPEN * 10) / 10,
      netProfitPEN: Math.round(netProfitPEN * 10) / 10,
      marginPercent,
      activeProductsCount: (prodRows || []).length,
      activeProvidersCount: (provRows || []).filter((p) => p.status === 'active').length,
      totalProvidersCount: (provRows || []).length,
      providers: (provRows || []).map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        status: p.status,
        balanceUSD: Number(p.balanceusd ?? p.balanceUSD ?? 0),
        productCount: (prodRows || []).filter((pr) => (pr.providerid || pr.providerId) === p.id).length,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/store/settings - Store configuration
app.get('/api/store/settings', async (req, res) => {
  try {
    const rows = await getAll('SELECT * FROM store_settings');
    const settings = {};
    (rows || []).forEach((r) => {
      settings[r.key] = r.value;
    });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/store/settings - Update store configuration
app.post('/api/store/settings', async (req, res) => {
  const settings = req.body;
  const keys = Object.keys(settings);
  if (keys.length === 0) {
    res.status(400).json({ error: 'No hay configuraciones para guardar' });
    return;
  }

  try {
    for (const k of keys) {
      await execute('INSERT INTO store_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', [k, String(settings[k])]);
    }
    res.json({ success: true, message: 'Configuración guardada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server & Connect to PostgreSQL
app.listen(PORT, async () => {
  console.log(`Servidor API PostgreSQL corriendo en el puerto ${PORT}`);
  await initializeDatabase();
});
