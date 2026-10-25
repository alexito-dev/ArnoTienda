import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import { getBunaiProfile, getBunaiProducts, getBunaiProductDetails, createBunaiOrder } from './bunaiStoreService.js';
import { testProviderConnection, fetchProviderProducts, fulfillOrderItemWithProvider } from './multiProviderService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3008;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[SQLite] Error conectando a SQLite:', err.message);
  } else {
    console.log('[SQLite] Base de Datos SQLite conectada en:', dbPath);
  }
});

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
    id: 'claude-api-100',
    name: 'API Plan $100 USD (Claude API)',
    subtitle: 'Consola Anthropic',
    category: 'dev',
    badge: 'OFERTA',
    regionBadge: 'GLOBAL KEY',
    canActivateInCountry: 1,
    discountPercent: 33,
    originalPriceDisplay: '15.97',
    priceDisplay: '10.64',
    g2aPlusPriceDisplay: '9.50',
    yearlyPriceDisplay: '10.64',
    originalYearlyPriceDisplay: '15.97',
    priceUnit: 'USD / S/ 39.90 PEN',
    numericPrice: 10.64,
    numericYearlyPrice: 10.64,
    numericOriginalPrice: 15.97,
    sellerName: 'ArnoAI Official',
    sellerRating: 5.0,
    sellerFeedbackPercent: 100.0,
    sellerSales: 1240,
    shieldIncluded: 1,
    headerBg: 'slate',
    iconType: 'spark',
    description: 'Crédito oficial de $100 USD para Anthropic Console API. Ideal para conectar Claude 3.5 Sonnet a tus aplicaciones.',
    checklist: JSON.stringify([
      '$100 USD de saldo en Anthropic Console API',
      'Acceso completo a Claude 3.5 Sonnet y Haiku',
      'Llave API oficial con soporte de Webhooks',
      'Garantía total de uso en producción',
    ]),
    modelsIncluded: JSON.stringify(['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus']),
    specs: JSON.stringify([
      { label: 'Saldo API', value: '$100.00 USD' },
      { label: 'Proveedor', value: 'Anthropic Console' },
      { label: 'Entrega', value: 'API Key Oficial / Credenciales' },
    ]),
    idealFor: 'Desarrolladores y startups integrando IA avanzada en sus plataformas.',
    activationKeySample: 'sk-ant-api03-ARNO-100USD-LIVE-8812',
    imageUrl: '',
    isActive: 1,
  },
  {
    id: 'claude-api-250',
    name: 'API Plan $250 USD (Claude API)',
    subtitle: 'Consola Anthropic',
    category: 'dev',
    badge: 'POPULAR',
    regionBadge: 'GLOBAL KEY',
    canActivateInCountry: 1,
    discountPercent: 35,
    originalPriceDisplay: '19.95',
    priceDisplay: '13.30',
    g2aPlusPriceDisplay: '11.90',
    yearlyPriceDisplay: '13.30',
    originalYearlyPriceDisplay: '19.95',
    priceUnit: 'USD / S/ 49.90 PEN',
    numericPrice: 13.30,
    numericYearlyPrice: 13.30,
    numericOriginalPrice: 19.95,
    sellerName: 'ArnoAI Official',
    sellerRating: 5.0,
    sellerFeedbackPercent: 100.0,
    sellerSales: 1120,
    shieldIncluded: 1,
    headerBg: 'dark-purple',
    iconType: 'spark',
    description: 'Crédito oficial de $250 USD para Anthropic Console API. Acceso garantizado por 30 días a Claude 3.5 Sonnet y Opus.',
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

// Initialize Database Table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      badge TEXT,
      regionBadge TEXT,
      canActivateInCountry INTEGER DEFAULT 1,
      discountPercent INTEGER DEFAULT 0,
      originalPriceDisplay TEXT,
      priceDisplay TEXT NOT NULL,
      g2aPlusPriceDisplay TEXT,
      yearlyPriceDisplay TEXT,
      originalYearlyPriceDisplay TEXT,
      priceUnit TEXT,
      numericPrice REAL NOT NULL,
      numericYearlyPrice REAL NOT NULL,
      numericOriginalPrice REAL,
      sellerName TEXT DEFAULT 'ArnoAI Official',
      sellerRating REAL DEFAULT 4.9,
      sellerFeedbackPercent REAL DEFAULT 99.8,
      sellerSales INTEGER DEFAULT 3420,
      shieldIncluded INTEGER DEFAULT 1,
      headerBg TEXT DEFAULT 'purple',
      iconType TEXT DEFAULT 'spark',
      description TEXT,
      checklist TEXT,
      modelsIncluded TEXT,
      specs TEXT,
      idealFor TEXT,
      activationKeySample TEXT,
      imageUrl TEXT,
      isActive INTEGER DEFAULT 1,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('[SQLite] Error creando tabla products:', err.message);
      return;
    }

    // Safely add provider columns if they do not exist
    db.run('ALTER TABLE products ADD COLUMN bunaiProductId TEXT', () => {});
    db.run('ALTER TABLE products ADD COLUMN bunaiStock INTEGER DEFAULT 0', () => {});
    db.run('ALTER TABLE products ADD COLUMN wholesalePriceUSD REAL DEFAULT 0', () => {});
    db.run("ALTER TABLE products ADD COLUMN providerId TEXT DEFAULT 'bunaistore'", () => {});
    db.run("ALTER TABLE products ADD COLUMN providerName TEXT DEFAULT 'BunaiStore'", () => {});
    db.run('ALTER TABLE products ADD COLUMN providerProductId TEXT', () => {});

    // Create Multi-Providers Table
    db.run(`
      CREATE TABLE IF NOT EXISTS providers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT DEFAULT 'custom',
        apiBaseUrl TEXT NOT NULL,
        apiKey TEXT,
        apiSecret TEXT,
        authHeaderName TEXT DEFAULT 'X-API-Key',
        pingEndpoint TEXT,
        balanceUSD REAL DEFAULT 0.0,
        status TEXT DEFAULT 'active',
        autoFulfill INTEGER DEFAULT 1,
        marginMultiplier REAL DEFAULT 3.0,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      // Seed default providers if empty
      db.get('SELECT COUNT(*) as count FROM providers', (err, row) => {
        if (!err && row && row.count === 0) {
          const stmt = db.prepare(`
            INSERT INTO providers (id, name, type, apiBaseUrl, apiKey, authHeaderName, pingEndpoint, balanceUSD, status, autoFulfill, marginMultiplier, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          stmt.run([
            'bunaistore',
            'BunaiStore Wholesale',
            'bunaistore',
            'https://api.bunaistore.shop/v1',
            process.env.BUNAISTORE_API_KEY || 'Shop::2WR8PHImP8Njh3kHI6twuz2AWF8',
            'X-API-Key',
            'me',
            0.099,
            'active',
            1,
            3.5,
            'Proveedor principal de licencias IA y suscripciones digitales'
          ]);
          stmt.run([
            'g2a',
            'G2A Direct Business API',
            'g2a',
            'https://api.g2a.com/v1',
            '',
            'Authorization',
            'status',
            0.0,
            'inactive',
            0,
            2.5,
            'Catálogo global de software y claves oficiales'
          ]);
          stmt.run([
            'kinguin',
            'Kinguin Reseller Gateway',
            'kinguin',
            'https://gateway.kinguin.net/esa/api/v1',
            '',
            'X-Api-Key',
            'products',
            0.0,
            'inactive',
            0,
            2.5,
            'Distribuidor europeo de licencias'
          ]);
          stmt.run([
            'custom_api',
            'API Mayorista Externa',
            'custom',
            'https://api.example.com/v1',
            '',
            'Authorization',
            'health',
            0.0,
            'inactive',
            1,
            3.0,
            'Conector genérico REST para proveedores adicionales'
          ]);
          stmt.finalize();
        }
      });
    });

    // Create Orders Table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerName TEXT,
        customerEmail TEXT,
        customerPhone TEXT,
        paymentMethod TEXT,
        totalPEN REAL NOT NULL,
        status TEXT DEFAULT 'completado',
        fulfillmentStatus TEXT DEFAULT 'entregado',
        items TEXT,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, () => {
      // Seed sample orders if empty
      db.get('SELECT COUNT(*) as count FROM orders', (err, row) => {
        if (!err && row && row.count === 0) {
          const sampleItems1 = JSON.stringify([{
            productId: 'bunai-54268daa',
            productName: 'Claude API $500 Saldo Anthropic',
            quantity: 1,
            pricePEN: 49.90,
            activationKey: 'sk-ant-api03-ARNO-500USD-LIVE-8812',
            providerId: 'bunaistore',
            providerStatus: 'entregado'
          }]);
          const sampleItems2 = JSON.stringify([{
            productId: 'bunai-aec43957',
            productName: 'Microsoft Office 365 (Plan Lifetime)',
            quantity: 1,
            pricePEN: 24.90,
            activationKey: 'OFFICE-365-ARNO-ORG-9921',
            providerId: 'bunaistore',
            providerStatus: 'entregado'
          }]);
          db.run(`INSERT INTO orders (id, customerName, customerEmail, customerPhone, paymentMethod, totalPEN, status, fulfillmentStatus, items, notes)
                  VALUES ('ORD-771291', 'Alex C.', 'contacto@arno.services', '+51 987654321', 'Yape / Plin', 49.90, 'completado', 'entregado', ?, 'Entrega automática exitosa')`, [sampleItems1]);
          db.run(`INSERT INTO orders (id, customerName, customerEmail, customerPhone, paymentMethod, totalPEN, status, fulfillmentStatus, items, notes)
                  VALUES ('ORD-771292', 'Carlos M.', 'carlos@empresa.pe', '+51 912345678', 'Arno Wallet', 24.90, 'completado', 'entregado', ?, 'Licencia activada')`, [sampleItems2]);
        }
      });
    });

    // Create Store Settings Table
    db.run(`
      CREATE TABLE IF NOT EXISTS store_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `, () => {
      db.run(`INSERT OR IGNORE INTO store_settings (key, value) VALUES ('exchangeRatePEN', '3.75')`);
      db.run(`INSERT OR IGNORE INTO store_settings (key, value) VALUES ('storeName', 'ArnoTienda')`);
      db.run(`INSERT OR IGNORE INTO store_settings (key, value) VALUES ('defaultMarginMultiplier', '3.0')`);
      db.run(`INSERT OR IGNORE INTO store_settings (key, value) VALUES ('autoFulfill', '1')`);
    });

    // Seed database if empty
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (!err && row && row.count === 0) {
        console.log('[SQLite] Poblando base de datos SQLite con productos iniciales...');
        const stmt = db.prepare(`
          INSERT INTO products (
            id, name, subtitle, category, badge, regionBadge, canActivateInCountry,
            discountPercent, originalPriceDisplay, priceDisplay, g2aPlusPriceDisplay,
            yearlyPriceDisplay, originalYearlyPriceDisplay, priceUnit, numericPrice,
            numericYearlyPrice, numericOriginalPrice, sellerName, sellerRating,
            sellerFeedbackPercent, sellerSales, shieldIncluded, headerBg, iconType,
            description, checklist, modelsIncluded, specs, idealFor, activationKeySample, imageUrl, isActive
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        INITIAL_SEED.forEach((p) => {
          stmt.run([
            p.id, p.name, p.subtitle, p.category, p.badge, p.regionBadge, p.canActivateInCountry,
            p.discountPercent, p.originalPriceDisplay, p.priceDisplay, p.g2aPlusPriceDisplay,
            p.yearlyPriceDisplay, p.originalYearlyPriceDisplay, p.priceUnit, p.numericPrice,
            p.numericYearlyPrice, p.numericOriginalPrice, p.sellerName, p.sellerRating,
            p.sellerFeedbackPercent, p.sellerSales, p.shieldIncluded, p.headerBg, p.iconType,
            p.description, p.checklist, p.modelsIncluded, p.specs, p.idealFor, p.activationKeySample, p.imageUrl, p.isActive
          ]);
        });

        stmt.finalize(() => {
          console.log('[SQLite] Base de datos poblada exitosamente.');
        });
      }
    });
  });
});

// Helper to format DB row to Product object
const formatRowToProduct = (row) => ({
  ...row,
  canActivateInCountry: Boolean(row.canActivateInCountry),
  shieldIncluded: Boolean(row.shieldIncluded),
  isActive: Boolean(row.isActive),
  checklist: row.checklist ? JSON.parse(row.checklist) : [],
  modelsIncluded: row.modelsIncluded ? JSON.parse(row.modelsIncluded) : [],
  specs: row.specs ? JSON.parse(row.specs) : [],
  bunaiProductId: row.bunaiProductId || undefined,
  bunaiStock: row.bunaiStock !== undefined ? row.bunaiStock : undefined,
  wholesalePriceUSD: row.wholesalePriceUSD !== undefined ? row.wholesalePriceUSD : undefined,
  providerId: row.providerId || (row.bunaiProductId ? 'bunaistore' : 'local'),
  providerName: row.providerName || (row.bunaiProductId ? 'BunaiStore' : 'ArnoAI Direct'),
  providerProductId: row.providerProductId || row.bunaiProductId || undefined,
});

// GET /api/products - Get all products from SQLite DB
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY updatedAt DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const products = rows.map(formatRowToProduct);
    res.json(products);
  });
});

// POST /api/products - Insert or Update product in SQLite DB
app.post('/api/products', (req, res) => {
  const p = req.body;
  if (!p.id || !p.name) {
    res.status(400).json({ error: 'Faltan campos obligatorios id y name' });
    return;
  }

  const query = `
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

  db.run(query, [
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
  ], function(err) {
    if (err) {
      console.error('[SQLite] Error guardando producto en SQLite:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Producto guardado en SQLite', id: p.id });
  });
});

// DELETE /api/products/:id - Delete product from SQLite DB
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Producto eliminado de SQLite' });
  });
});

// POST /api/products/reset - Reset SQLite DB to initial seed
app.post('/api/products/reset', (req, res) => {
  db.run('DELETE FROM products', [], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const stmt = db.prepare(`
      INSERT INTO products (
        id, name, subtitle, category, badge, regionBadge, canActivateInCountry,
        discountPercent, originalPriceDisplay, priceDisplay, g2aPlusPriceDisplay,
        yearlyPriceDisplay, originalYearlyPriceDisplay, priceUnit, numericPrice,
        numericYearlyPrice, numericOriginalPrice, sellerName, sellerRating,
        sellerFeedbackPercent, sellerSales, shieldIncluded, headerBg, iconType,
        description, checklist, modelsIncluded, specs, idealFor, activationKeySample, imageUrl, isActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    INITIAL_SEED.forEach((p) => {
      stmt.run([
        p.id, p.name, p.subtitle, p.category, p.badge, p.regionBadge, p.canActivateInCountry,
        p.discountPercent, p.originalPriceDisplay, p.priceDisplay, p.g2aPlusPriceDisplay,
        p.yearlyPriceDisplay, p.originalYearlyPriceDisplay, p.priceUnit, p.numericPrice,
        p.numericYearlyPrice, p.numericOriginalPrice, p.sellerName, p.sellerRating,
        p.sellerFeedbackPercent, p.sellerSales, p.shieldIncluded, p.headerBg, p.iconType,
        p.description, p.checklist, p.modelsIncluded, p.specs, p.idealFor, p.activationKeySample, p.imageUrl, p.isActive
      ]);
    });

    stmt.finalize(() => {
      res.json({ success: true, message: 'Base de datos SQLite restablecida' });
    });
  });
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

// POST /api/bunaistore/sync - Sync a BunaiStore product into SQLite store products
app.post('/api/bunaistore/sync', (req, res) => {
  const p = req.body;
  if (!p.id || !p.name) {
    res.status(400).json({ error: 'Faltan campos id o name' });
    return;
  }

  const query = `
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

  db.run(query, [
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
  ], function(err) {
    if (err) {
      console.error('[BunaiStore] Error sincronizando producto BunaiStore:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Producto BunaiStore sincronizado exitosamente en la tienda', id: p.id });
  });
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
app.get('/api/providers', (req, res) => {
  db.all('SELECT * FROM providers ORDER BY createdAt ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Attach product count for each provider
    db.all('SELECT providerId, COUNT(*) as count FROM products GROUP BY providerId', [], (err2, countRows) => {
      const countMap = {};
      (countRows || []).forEach((c) => {
        countMap[c.providerId] = c.count;
      });

      const formatted = rows.map((r) => ({
        ...r,
        autoFulfill: Boolean(r.autoFulfill),
        productCount: countMap[r.id] || (r.id === 'bunaistore' ? countMap['bunaistore'] || 14 : 0),
      }));
      res.json(formatted);
    });
  });
});

// POST /api/providers - Create or Update a provider
app.post('/api/providers', (req, res) => {
  const p = req.body;
  if (!p.id || !p.name || !p.apiBaseUrl) {
    res.status(400).json({ error: 'Faltan campos obligatorios: id, name o apiBaseUrl' });
    return;
  }

  const query = `
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

  db.run(query, [
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
  ], function(err) {
    if (err) {
      console.error('[MultiProvider] Error guardando proveedor:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Proveedor configurado exitosamente', id: p.id });
  });
});

// DELETE /api/providers/:id - Delete a provider
app.delete('/api/providers/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM providers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Proveedor eliminado' });
  });
});

// POST /api/providers/:id/test - Test connection & live balance
app.post('/api/providers/:id/test', async (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM providers WHERE id = ?', [id], async (err, row) => {
    if (err || !row) {
      res.status(404).json({ error: 'Proveedor no encontrado' });
      return;
    }

    const testResult = await testProviderConnection(row);
    if (testResult.success) {
      const balance = testResult.balanceUSD !== undefined ? testResult.balanceUSD : row.balanceUSD;
      db.run('UPDATE providers SET balanceUSD = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [
        balance,
        'active',
        id,
      ]);
    } else {
      db.run('UPDATE providers SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [
        'error',
        id,
      ]);
    }

    res.json(testResult);
  });
});

// GET /api/providers/:id/products - Fetch live catalog from a provider
app.get('/api/providers/:id/products', async (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM providers WHERE id = ?', [id], async (err, row) => {
    if (err || !row) {
      res.status(404).json({ error: 'Proveedor no encontrado' });
      return;
    }

    const limit = parseInt(req.query.limit, 10) || 100;
    const prods = await fetchProviderProducts(row, limit);
    res.json(prods);
  });
});

// POST /api/providers/sync-product - Universal product sync from any provider
app.post('/api/providers/sync-product', (req, res) => {
  const p = req.body;
  if (!p.id || !p.name) {
    res.status(400).json({ error: 'Faltan campos id o name' });
    return;
  }

  const query = `
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

  db.run(query, [
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
  ], function(err) {
    if (err) {
      console.error('[MultiProvider] Error sincronizando producto:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Producto sincronizado exitosamente en el catalogo de la tienda', id: p.id });
  });
});

// Orders Management Endpoints
// GET /api/orders - List all customer orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const formatted = rows.map((r) => ({
      ...r,
      items: r.items ? JSON.parse(r.items) : [],
    }));
    res.json(formatted);
  });
});

// POST /api/orders - Create or record an order from store checkout
app.post('/api/orders', (req, res) => {
  const { id, customerName, customerEmail, customerPhone, paymentMethod, totalPEN, items, notes } = req.body;
  if (!id || !items) {
    res.status(400).json({ error: 'Faltan campos id o items' });
    return;
  }

  const itemsJson = typeof items === 'string' ? items : JSON.stringify(items);
  const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

  const query = `
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

  db.run(query, [
    id,
    customerName || 'Cliente ArnoTienda',
    customerEmail || '',
    customerPhone || '',
    paymentMethod || 'Yape / Plin',
    totalPEN || 0,
    itemsJson,
    notes || 'Orden registrada desde pasarela de compra'
  ], async function(err) {
    if (err) {
      console.error('[Orders] Error guardando pedido:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    // Check if any item belongs to an active auto-fulfill provider
    try {
      db.all('SELECT * FROM providers WHERE autoFulfill = 1', [], async (errP, providers) => {
        if (!errP && providers && providers.length > 0) {
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
      });
    } catch {}

    res.json({ success: true, message: 'Pedido guardado en la base de datos', orderId: id });
  });
});

// PATCH /api/orders/:id - Update order status or details
app.patch('/api/orders/:id', (req, res) => {
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

  const query = `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`;
  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Pedido actualizado exitosamente' });
  });
});

// POST /api/orders/:id/dispatch - Manually re-trigger fulfillment with provider API
app.post('/api/orders/:id/dispatch', (req, res) => {
  const orderId = req.params.id;
  db.get('SELECT * FROM orders WHERE id = ?', [orderId], async (err, order) => {
    if (err || !order) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    const items = order.items ? JSON.parse(order.items) : [];
    const firstItem = items[0];
    if (!firstItem) {
      res.status(400).json({ error: 'El pedido no tiene items' });
      return;
    }

    const providerId = firstItem.providerId || 'bunaistore';
    db.get('SELECT * FROM providers WHERE id = ?', [providerId], async (errP, prov) => {
      if (errP || !prov) {
        res.status(400).json({ error: `Proveedor ${providerId} no configurado` });
        return;
      }

      const prodId = firstItem.providerProductId || firstItem.productId?.replace('bunai-', '');
      const fulfillRes = await fulfillOrderItemWithProvider(prov, prodId, firstItem.quantity || 1);

      if (fulfillRes.success && fulfillRes.keys?.length > 0) {
        firstItem.activationKey = fulfillRes.keys[0];
        firstItem.providerStatus = 'entregado';
        db.run('UPDATE orders SET fulfillmentStatus = ?, items = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [
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
    });
  });
});

// Store Metrics & Settings
// GET /api/store/metrics - Real-time financial dashboard & sales
app.get('/api/store/metrics', (req, res) => {
  db.all('SELECT * FROM orders', [], (err, ordersRows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.all('SELECT * FROM products WHERE isActive = 1', [], (err2, prodRows) => {
      if (err2) {
        res.status(500).json({ error: err2.message });
        return;
      }
      db.all('SELECT * FROM providers', [], (err3, provRows) => {
        if (err3) {
          res.status(500).json({ error: err3.message });
          return;
        }

        const totalOrders = (ordersRows || []).length;
        const totalSalesPEN = (ordersRows || []).reduce((acc, o) => acc + (o.totalPEN || 0), 0);

        let estimatedCostPEN = 0;
        (ordersRows || []).forEach((o) => {
          try {
            const items = o.items ? JSON.parse(o.items) : [];
            items.forEach((it) => {
              const prod = (prodRows || []).find((p) => p.id === it.productId || p.name === it.productName);
              const costUSD = prod ? (prod.wholesalePriceUSD || 0) : 0;
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
            balanceUSD: p.balanceUSD || 0,
            productCount: (prodRows || []).filter((pr) => pr.providerId === p.id).length,
          })),
        });
      });
    });
  });
});

// GET /api/store/settings - Store configuration
app.get('/api/store/settings', (req, res) => {
  db.all('SELECT * FROM store_settings', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const settings = {};
    (rows || []).forEach((r) => {
      settings[r.key] = r.value;
    });
    res.json(settings);
  });
});

// POST /api/store/settings - Update store configuration
app.post('/api/store/settings', (req, res) => {
  const settings = req.body;
  const keys = Object.keys(settings);
  if (keys.length === 0) {
    res.status(400).json({ error: 'No hay configuraciones para guardar' });
    return;
  }

  const stmt = db.prepare('INSERT INTO store_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  keys.forEach((k) => {
    stmt.run([k, String(settings[k])]);
  });
  stmt.finalize((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Configuracion guardada exitosamente' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor API SQLite corriendo en http://localhost:${PORT}`);
});
