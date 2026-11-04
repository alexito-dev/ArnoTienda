import pg from 'pg';

const { Pool } = pg;

// Support full DATABASE_URL or individual PG env variables
const connectionString = process.env.DATABASE_URL || 'postgresql://arno_admin:arno_tienda_secret_pass_2026@localhost:5432/arnotienda';

export const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Error inesperado en el pool de clientes:', err.message);
});

// Helper to convert ? placeholder syntax to $1, $2, $3 for PostgreSQL
export function toPgQuery(sql) {
  let count = 1;
  return sql.replace(/\?/g, () => `$${count++}`);
}

// Universal query runner
export async function query(sql, params = []) {
  const pgSql = toPgQuery(sql);
  const start = Date.now();
  try {
    const res = await pool.query(pgSql, params);
    return res;
  } catch (err) {
    console.error(`[PostgreSQL] Error ejecutando query:`, { sql: pgSql, error: err.message });
    throw err;
  }
}

// Single row getter
export async function getOne(sql, params = []) {
  const res = await query(sql, params);
  return res.rows[0] || null;
}

// Multi row getter
export async function getAll(sql, params = []) {
  const res = await query(sql, params);
  return res.rows;
}

// Execute command
export async function execute(sql, params = []) {
  const res = await query(sql, params);
  return { rowCount: res.rowCount, rows: res.rows };
}

// Connect with retry logic (crucial for Docker orchestration while PostgreSQL warms up)
export async function connectWithRetry(maxRetries = 10, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await pool.connect();
      console.log(`[PostgreSQL] Conexión establecida con éxito en intento ${attempt}`);
      client.release();
      return true;
    } catch (err) {
      console.warn(`[PostgreSQL] Intento ${attempt}/${maxRetries} falló (${err.message}). Reintentando en ${delayMs / 1000}s...`);
      if (attempt === maxRetries) {
        throw new Error(`[PostgreSQL] No se pudo conectar a la base de datos tras ${maxRetries} intentos: ${err.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

// Initialize tables and schemas
export async function initDatabaseSchemas() {
  console.log('[PostgreSQL] Verificando e inicializando esquemas de tablas...');

  // Products Table
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255),
      category VARCHAR(100) NOT NULL,
      badge VARCHAR(100),
      regionBadge VARCHAR(100),
      canActivateInCountry INTEGER DEFAULT 1,
      discountPercent INTEGER DEFAULT 0,
      originalPriceDisplay VARCHAR(100),
      priceDisplay VARCHAR(100) NOT NULL,
      g2aPlusPriceDisplay VARCHAR(100),
      yearlyPriceDisplay VARCHAR(100),
      originalYearlyPriceDisplay VARCHAR(100),
      priceUnit VARCHAR(100),
      numericPrice NUMERIC(10, 2) NOT NULL,
      numericYearlyPrice NUMERIC(10, 2) NOT NULL,
      numericOriginalPrice NUMERIC(10, 2),
      sellerName VARCHAR(255) DEFAULT 'ArnoAI Official',
      sellerRating NUMERIC(3, 2) DEFAULT 4.9,
      sellerFeedbackPercent NUMERIC(5, 2) DEFAULT 99.8,
      sellerSales INTEGER DEFAULT 3420,
      shieldIncluded INTEGER DEFAULT 1,
      headerBg VARCHAR(100) DEFAULT 'purple',
      iconType VARCHAR(100) DEFAULT 'spark',
      description TEXT,
      checklist TEXT,
      modelsIncluded TEXT,
      specs TEXT,
      idealFor TEXT,
      activationKeySample TEXT,
      imageUrl TEXT,
      isActive INTEGER DEFAULT 1,
      bunaiProductId VARCHAR(255),
      bunaiStock INTEGER DEFAULT 0,
      wholesalePriceUSD NUMERIC(10, 2) DEFAULT 0,
      providerId VARCHAR(100) DEFAULT 'bunaistore',
      providerName VARCHAR(255) DEFAULT 'BunaiStore',
      providerProductId VARCHAR(255),
      updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Providers Table
  await query(`
    CREATE TABLE IF NOT EXISTS providers (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100) DEFAULT 'custom',
      apiBaseUrl TEXT NOT NULL,
      apiKey TEXT,
      apiSecret TEXT,
      authHeaderName VARCHAR(100) DEFAULT 'X-API-Key',
      pingEndpoint VARCHAR(255),
      balanceUSD NUMERIC(10, 2) DEFAULT 0.0,
      status VARCHAR(50) DEFAULT 'active',
      autoFulfill INTEGER DEFAULT 1,
      marginMultiplier NUMERIC(5, 2) DEFAULT 3.0,
      notes TEXT,
      createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Orders Table
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(100) PRIMARY KEY,
      customerName VARCHAR(255),
      customerEmail VARCHAR(255),
      customerPhone VARCHAR(100),
      paymentMethod VARCHAR(100),
      totalPEN NUMERIC(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'completado',
      fulfillmentStatus VARCHAR(50) DEFAULT 'entregado',
      items TEXT,
      notes TEXT,
      createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Store Settings Table
  await query(`
    CREATE TABLE IF NOT EXISTS store_settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT
    )
  `);

  console.log('[PostgreSQL] Esquemas de tablas confirmados exitosamente.');
}
