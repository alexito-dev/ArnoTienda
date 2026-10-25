import React, { useState, useEffect } from 'react';
import { Product, CategoryId } from '../../types/store';
import { api, BunaiProduct, BunaiProfile } from '../../services/api';
import {
  Zap,
  RefreshCw,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Layers,
  Search,
  DollarSign,
  PackageCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Wallet,
  Clock,
  Sliders,
  Store
} from 'lucide-react';

interface Props {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  showToast: (msg: string) => void;
}

// Recommended top items with optimized configurations
const TOP_RECOMMENDED_MAPPINGS: {
  productId: string;
  category: CategoryId;
  suggestedPEN: number;
  customName?: string;
  subtitle?: string;
}[] = [
  { productId: 'a90cb663', category: 'multimodal', suggestedPEN: 29.90, customName: 'Gemini Pro (18 Meses Plan Familiar)', subtitle: 'Google One 18 Meses + Flow' },
  { productId: 'aec43957', category: 'corporativo', suggestedPEN: 24.90, customName: 'Microsoft Office 365 (Plan Lifetime)', subtitle: 'Cuenta de Organización + OneDrive' },
  { productId: '54268daa', category: 'dev', suggestedPEN: 49.90, customName: 'Claude API $500 Saldo Anthropic', subtitle: 'Clave API Oficial $500 USD' },
  { productId: 'c3a7d388', category: 'dev', suggestedPEN: 24.90, customName: 'Claude API $100 Saldo Anthropic', subtitle: 'Clave API Oficial $100 USD' },
  { productId: '42cbda7e', category: 'multimodal', suggestedPEN: 18.90, customName: 'CapCut Pro 1 Mes', subtitle: 'Editor de Video Premium' },
  { productId: '2040040d', category: 'multimodal', suggestedPEN: 17.90, customName: 'CapCut Pro Individual 1 Mes', subtitle: 'Cuenta Individual Garantizada' },
  { productId: 'dc731d7e', category: 'corporativo', suggestedPEN: 14.90, customName: 'Duolingo Super 12 Meses', subtitle: 'Plan Anual Idiomas Ilimitado' },
  { productId: '303a4520', category: 'multimodal', suggestedPEN: 15.00, customName: 'Canva Edu Pro 1 Año', subtitle: 'Diseño Gráfico Completo' },
  { productId: '1ad55ccb', category: 'corporativo', suggestedPEN: 19.90, customName: 'Spotify Premium 3 Meses', subtitle: 'Música Sin Anuncios Offline' },
  { productId: '58e7f9d0', category: 'dev', suggestedPEN: 19.90, customName: 'Windows 10/11 Pro Retail Key', subtitle: 'Licencia Digital Oficial Permanente' },
  { productId: '8f5fa76e', category: 'dev', suggestedPEN: 24.90, customName: 'NordVPN 3 Meses al Correo', subtitle: 'VPN Ultrarrápida y Segura' },
  { productId: '5a272b00', category: 'corporativo', suggestedPEN: 22.90, customName: 'Notion Business 3 Meses', subtitle: 'Espacio de Trabajo IA Ilimitado' },
  { productId: '18bc8f7c', category: 'corporativo', suggestedPEN: 24.90, customName: 'LinkedIn Career Premium 3 Meses', subtitle: 'InMail y Cursos Ilimitados' },
  { productId: 'ea664f22', category: 'multimodal', suggestedPEN: 39.90, customName: 'Kling AI Standard 1000+ Créditos', subtitle: 'Generación de Video IA de Alta Calidad' },
];

export const BunaiStoreTab: React.FC<Props> = ({ products, onUpdateProducts, showToast }) => {
  const [profile, setProfile] = useState<BunaiProfile | null>(null);
  const [catalog, setCatalog] = useState<BunaiProduct[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [batchSyncing, setBatchSyncing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [stockTypeFilter, setStockTypeFilter] = useState<'all' | 'auto' | 'manual'>('all');

  // Multiplier / Custom Price Map
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [customCategories, setCustomCategories] = useState<Record<string, CategoryId>>({});
  const [marginMultiplier, setMarginMultiplier] = useState<number>(3.5);

  const loadData = async () => {
    setLoadingProfile(true);
    setLoadingCatalog(true);

    const [prof, prods] = await Promise.all([
      api.getBunaiProfile(),
      api.getBunaiProducts(100),
    ]);

    setProfile(prof);
    setCatalog(prods);
    setLoadingProfile(false);
    setLoadingCatalog(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getSuggestedPricePEN = (bp: BunaiProduct): number => {
    // If customized in state, use it
    if (customPrices[bp.product_id]) {
      return customPrices[bp.product_id];
    }
    // Check if in recommended list
    const rec = TOP_RECOMMENDED_MAPPINGS.find(r => r.productId === bp.product_id);
    if (rec) {
      return rec.suggestedPEN;
    }
    // Default calculation based on wholesale USD * 3.75 * multiplier
    const costPEN = bp.price * 3.75;
    const computed = Math.round(costPEN * marginMultiplier);
    return Math.max(9.90, computed < 15 ? 14.90 : computed);
  };

  const getProductCategory = (bp: BunaiProduct): CategoryId => {
    if (customCategories[bp.product_id]) {
      return customCategories[bp.product_id];
    }
    const rec = TOP_RECOMMENDED_MAPPINGS.find(r => r.productId === bp.product_id);
    if (rec) return rec.category;
    const nameLower = bp.name.toLowerCase();
    if (nameLower.includes('api') || nameLower.includes('key') || nameLower.includes('windows') || nameLower.includes('vpn')) return 'dev';
    if (nameLower.includes('office') || nameLower.includes('duolingo') || nameLower.includes('notion') || nameLower.includes('linkedin') || nameLower.includes('spotify')) return 'corporativo';
    return 'multimodal';
  };

  const isProductSynced = (bp: BunaiProduct): boolean => {
    return products.some(p => p.bunaiProductId === bp.product_id || p.id === `bunai-${bp.product_id}`);
  };

  const handleSyncProduct = async (bp: BunaiProduct) => {
    setSyncingId(bp.product_id);
    const retailPEN = getSuggestedPricePEN(bp);
    const cat = getProductCategory(bp);
    const rec = TOP_RECOMMENDED_MAPPINGS.find(r => r.productId === bp.product_id);

    const usdPrice = Math.round((retailPEN / 3.75) * 100) / 100;
    const originalPriceUSD = Math.round(usdPrice * 1.5 * 100) / 100;
    const discountPercent = 33;

    const payload: Partial<Product> = {
      id: `bunai-${bp.product_id}`,
      bunaiProductId: bp.product_id,
      bunaiStock: bp.stock_count,
      wholesalePriceUSD: bp.price,
      name: rec?.customName || bp.name,
      subtitle: rec?.subtitle || (bp.stock_type === 'auto' ? 'Entrega Automática Inmediata' : 'Activación Garantizada'),
      category: cat,
      badge: 'BUNAISTORE',
      regionBadge: 'GLOBAL KEY',
      canActivateInCountry: true,
      discountPercent,
      originalPriceDisplay: originalPriceUSD.toFixed(2),
      priceDisplay: usdPrice.toFixed(2),
      g2aPlusPriceDisplay: (usdPrice * 0.9).toFixed(2),
      yearlyPriceDisplay: usdPrice.toFixed(2),
      originalYearlyPriceDisplay: originalPriceUSD.toFixed(2),
      priceUnit: `USD / S/ ${retailPEN.toFixed(2)} PEN`,
      numericPrice: usdPrice,
      numericYearlyPrice: usdPrice,
      numericOriginalPrice: originalPriceUSD,
      sellerName: 'BunaiStore Verified',
      sellerRating: 4.9,
      sellerFeedbackPercent: 99.8,
      sellerSales: 1540,
      shieldIncluded: true,
      headerBg: 'dark-purple',
      iconType: 'zap',
      description: bp.note
        ? bp.note.replace(/<[^>]+>/g, '').trim()
        : `Licencia digital oficial de ${bp.name}. Activación garantizada con entrega instantánea 24/7.`,
      checklist: [
        'Licencia o cuenta oficial garantizada',
        'Entrega automática instantánea 24/7',
        bp.warranty_hours > 0 ? `Garantía oficial de ${Math.round(bp.warranty_hours / 24)} días` : 'Garantía oficial de reposición',
        'Soporte técnico prioritario por WhatsApp'
      ],
      modelsIncluded: [rec?.customName || bp.name],
      specs: [
        { label: 'Proveedor', value: 'BunaiStore API' },
        { label: 'Tipo Entrega', value: bp.stock_type === 'auto' ? 'Instantánea (Auto)' : 'Manual asistida' },
        { label: 'Garantía', value: bp.warranty_hours > 0 ? `${Math.round(bp.warranty_hours / 24)} Días` : '24 Horas Reposición' },
        { label: 'Stock Actual', value: `${bp.stock_count} unidades disponibles` }
      ],
      idealFor: `Usuarios y desarrolladores que necesitan ${rec?.customName || bp.name} con garantía oficial.`,
      activationKeySample: 'BUNAI-AUTO-DELIVERY',
      imageUrl: '',
      isActive: true,
    };

    const success = await api.syncBunaiProduct(payload);
    if (success) {
      const refreshed = await api.fetchProducts();
      if (refreshed) {
        onUpdateProducts(refreshed);
      }
      showToast(`Producto "${payload.name}" sincronizado exitosamente en la tienda`);
    } else {
      showToast('Error sincronizando producto');
    }
    setSyncingId(null);
  };

  const handleBatchSyncTop = async () => {
    setBatchSyncing(true);
    let count = 0;

    for (const rec of TOP_RECOMMENDED_MAPPINGS) {
      const bp = catalog.find(item => item.product_id === rec.productId);
      if (bp && bp.stock_count > 0) {
        const retailPEN = rec.suggestedPEN;
        const usdPrice = Math.round((retailPEN / 3.75) * 100) / 100;
        const originalPriceUSD = Math.round(usdPrice * 1.5 * 100) / 100;

        const payload: Partial<Product> = {
          id: `bunai-${bp.product_id}`,
          bunaiProductId: bp.product_id,
          bunaiStock: bp.stock_count,
          wholesalePriceUSD: bp.price,
          name: rec.customName || bp.name,
          subtitle: rec.subtitle || 'Entrega Automática Inmediata',
          category: rec.category,
          badge: 'BUNAISTORE',
          regionBadge: 'GLOBAL KEY',
          canActivateInCountry: true,
          discountPercent: 33,
          originalPriceDisplay: originalPriceUSD.toFixed(2),
          priceDisplay: usdPrice.toFixed(2),
          g2aPlusPriceDisplay: (usdPrice * 0.9).toFixed(2),
          yearlyPriceDisplay: usdPrice.toFixed(2),
          originalYearlyPriceDisplay: originalPriceUSD.toFixed(2),
          priceUnit: `USD / S/ ${retailPEN.toFixed(2)} PEN`,
          numericPrice: usdPrice,
          numericYearlyPrice: usdPrice,
          numericOriginalPrice: originalPriceUSD,
          sellerName: 'BunaiStore Verified',
          sellerRating: 4.9,
          sellerFeedbackPercent: 99.8,
          sellerSales: 1850,
          shieldIncluded: true,
          headerBg: 'dark-purple',
          iconType: 'zap',
          description: bp.note
            ? bp.note.replace(/<[^>]+>/g, '').trim()
            : `Licencia digital oficial de ${rec.customName || bp.name}. Activación garantizada y entrega instantánea.`,
          checklist: [
            'Licencia o cuenta oficial garantizada',
            'Entrega automática instantánea 24/7',
            bp.warranty_hours > 0 ? `Garantía oficial de ${Math.round(bp.warranty_hours / 24)} días` : 'Garantía oficial de reposición',
            'Soporte técnico prioritario por WhatsApp'
          ],
          modelsIncluded: [rec.customName || bp.name],
          specs: [
            { label: 'Proveedor', value: 'BunaiStore API' },
            { label: 'Tipo Entrega', value: bp.stock_type === 'auto' ? 'Instantánea (Auto)' : 'Manual' },
            { label: 'Garantía', value: bp.warranty_hours > 0 ? `${Math.round(bp.warranty_hours / 24)} Días` : '24 Horas Reposición' },
            { label: 'Stock Actual', value: `${bp.stock_count} unidades disponibles` }
          ],
          idealFor: `Profesionales y desarrolladores que necesitan ${rec.customName || bp.name}.`,
          activationKeySample: 'BUNAI-AUTO-DELIVERY',
          imageUrl: '',
          isActive: true,
        };

        const ok = await api.syncBunaiProduct(payload);
        if (ok) count++;
      }
    }

    const refreshed = await api.fetchProducts();
    if (refreshed) {
      onUpdateProducts(refreshed);
    }
    setBatchSyncing(false);
    showToast(`Se sincronizaron ${count} productos estrella en stock a la tienda`);
  };

  // Filter Catalog
  const filteredCatalog = catalog.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.product_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = onlyInStock ? item.stock_count > 0 : true;
    const matchesType = stockTypeFilter === 'all' ? true : item.stock_type === stockTypeFilter;
    return matchesSearch && matchesStock && matchesType;
  });

  const totalInStock = catalog.filter(c => c.stock_count > 0).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Account & API Status Bar */}
      <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-lg font-black text-[var(--color-text)]">
                  Conexión API BunaiStore
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-extrabold flex items-center space-x-1 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>API Activa y Verificada</span>
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Catálogo mayorista en tiempo real con aprovisionamiento directo de claves y credenciales.
              </p>
              <div className="text-[11px] font-mono text-[var(--color-text-muted)] mt-1">
                Endpoint: api.bunaistore.shop • Key: Shop::2WR8...AWF8
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-[var(--color-border)] flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] block">Saldo Mayorista</span>
                <span className="text-sm font-black text-emerald-500">
                  ${profile ? profile.balance.toFixed(3) : '0.00'} USD
                  <span className="text-[10px] font-semibold text-[var(--color-text-muted)] ml-1">
                    (S/ {profile ? (profile.balance * 3.75).toFixed(2) : '0.00'} PEN)
                  </span>
                </span>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-[var(--color-border)] flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                <PackageCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] block">Cuenta</span>
                <span className="text-sm font-black text-[var(--color-text)]">
                  {profile ? profile.display_name : 'alexito'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={loadData}
                disabled={loadingProfile || loadingCatalog}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[var(--color-text)] transition cursor-pointer flex items-center space-x-1.5 text-xs font-bold"
                title="Recargar datos de BunaiStore"
              >
                <RefreshCw className={`w-4 h-4 ${(loadingProfile || loadingCatalog) ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>

              <a
                href="https://bunaistore.shop"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-2xl bg-[#847CB8] hover:bg-[#6F66A8] text-white transition cursor-pointer flex items-center space-x-1.5 text-xs font-black shadow-md"
              >
                <span>Recargar Saldo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Recommendation Sync Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#847CB8]/20 via-purple-600/10 to-indigo-600/15 border border-[#847CB8]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-[var(--color-text)]">
              Importación Inteligente en 1 Clic (Top 14 en Stock)
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Sincroniza automáticamente los productos más vendidos (Gemini Pro 18m, Office 365, Claude API $500, CapCut Pro, Duolingo, Canva, Spotify, Windows 11) con precios optimizados en Soles.
          </p>
        </div>

        <button
          onClick={handleBatchSyncTop}
          disabled={batchSyncing || catalog.length === 0}
          className="px-5 py-3 rounded-2xl bg-[#847CB8] hover:bg-[#6F66A8] text-white text-xs font-black transition cursor-pointer flex items-center space-x-2 shadow-lg shrink-0 disabled:opacity-50"
        >
          {batchSyncing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Store className="w-4 h-4" />
          )}
          <span>{batchSyncing ? 'Sincronizando...' : 'Sincronizar Top Recomendados'}</span>
        </button>
      </div>

      {/* Control & Filter Bar */}
      <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex items-center bg-white/5 border border-[var(--color-border)] rounded-2xl px-3.5 py-2 w-full md:w-80">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en BunaiStore (72 productos)..."
            className="w-full bg-transparent text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none font-semibold"
          />
        </div>

        {/* Toggles & Options */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Stock Filter Toggle */}
          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              onlyInStock
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/5 text-[var(--color-text-muted)] border border-transparent'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${onlyInStock ? 'opacity-100' : 'opacity-0'}`} />
            <span>Solo en Stock ({totalInStock})</span>
          </button>

          {/* Delivery Type Filter */}
          <select
            value={stockTypeFilter}
            onChange={(e) => setStockTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] focus:outline-none"
          >
            <option value="all">Todas las Entregas</option>
            <option value="auto">Auto Entrega (Instantánea)</option>
            <option value="manual">Manual Asistida</option>
          </select>

          {/* Multiplier Preset */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-[var(--color-border)] text-xs">
            <span className="text-[var(--color-text-muted)] font-semibold">Margen:</span>
            {[2.5, 3.5, 5.0].map((mult) => (
              <button
                key={mult}
                onClick={() => setMarginMultiplier(mult)}
                className={`px-2 py-0.5 rounded-lg font-black transition cursor-pointer text-[11px] ${
                  marginMultiplier === mult
                    ? 'bg-[#847CB8] text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCatalog.map((bp) => {
          const isSynced = isProductSynced(bp);
          const retailPEN = getSuggestedPricePEN(bp);
          const costPEN = bp.price * 3.75;
          const profitPEN = Math.max(0, retailPEN - costPEN);
          const marginPercent = Math.round((profitPEN / (costPEN || 0.1)) * 100);
          const isCurrentlySyncing = syncingId === bp.product_id;
          const rec = TOP_RECOMMENDED_MAPPINGS.find(r => r.productId === bp.product_id);

          return (
            <div
              key={bp.product_id}
              className={`p-5 rounded-3xl bg-[var(--color-surface)] border transition flex flex-col justify-between space-y-4 ${
                isSynced
                  ? 'border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/20'
                  : 'border-[var(--color-border)] hover:border-[#847CB8]/50'
              }`}
            >
              <div className="space-y-3">
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                        bp.stock_type === 'auto'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {bp.stock_type === 'auto' ? 'Auto Entrega' : 'Manual'}
                      </span>

                      {bp.stock_count > 0 ? (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-400">
                          {bp.stock_count} en stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-red-500/20 text-red-400">
                          Agotado
                        </span>
                      )}

                      {rec && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-500/20 text-amber-400">
                          Top
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-extrabold text-[var(--color-text)] line-clamp-2 leading-snug">
                      {rec?.customName || bp.name}
                    </h4>
                  </div>

                  {isSynced && (
                    <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0" title="Actualmente en Tienda">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Wholesale Cost & Profit breakdown */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[var(--color-text-muted)] font-semibold">
                    <span>Costo Mayorista Bunai:</span>
                    <span className="font-mono font-bold text-[var(--color-text)]">
                      ${bp.price.toFixed(2)} USD (S/ {costPEN.toFixed(2)})
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-[var(--color-text-muted)]">Margen Neto:</span>
                    <span className="font-mono font-bold text-emerald-500">
                      +{marginPercent}% (+S/ {profitPEN.toFixed(2)} PEN)
                    </span>
                  </div>
                </div>

                {/* Retail Price Input in Soles */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-[var(--color-text-muted)] flex items-center justify-between">
                    <span>Precio Venta al Cliente (Soles):</span>
                    <span className="text-[10px] text-purple-400 font-bold">Equiv: ${(retailPEN / 3.75).toFixed(2)} USD</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-black text-[var(--color-text-muted)]">
                      S/
                    </span>
                    <input
                      type="number"
                      step="0.10"
                      value={retailPEN}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setCustomPrices(prev => ({ ...prev, [bp.product_id]: val }));
                      }}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs font-extrabold text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSyncProduct(bp)}
                disabled={isCurrentlySyncing}
                className={`w-full py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm ${
                  isSynced
                    ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#847CB8] hover:bg-[#6F66A8] text-white'
                }`}
              >
                {isCurrentlySyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Guardando en BD...</span>
                  </>
                ) : isSynced ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Actualizar en Tienda</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Sincronizar a Tienda</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
