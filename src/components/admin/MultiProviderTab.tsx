import React, { useState, useEffect } from 'react';
import { Product, Provider, CategoryId } from '../../types/store';
import { api } from '../../services/api';
import {
  Zap,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Check,
  Store,
  Layers,
  Sliders,
  DollarSign,
  TrendingUp,
  Wallet,
  Globe,
  Lock,
  ArrowRight
} from 'lucide-react';

interface Props {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  showToast: (msg: string) => void;
}

export const MultiProviderTab: React.FC<Props> = ({ products, onUpdateProducts, showToast }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeProviderId, setActiveProviderId] = useState<string>('bunaistore');
  const [testingId, setTestingId] = useState<string | null>(null);

  // Provider Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Partial<Provider> | null>(null);

  // Provider Catalog Explorer State
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [syncingItemId, setSyncingItemId] = useState<string | null>(null);
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});

  const loadProviders = async () => {
    setLoading(true);
    const data = await api.fetchProviders();
    setProviders(data);
    setLoading(false);
    if (data.length > 0 && !activeProviderId) {
      setActiveProviderId(data[0].id);
    }
  };

  const loadProviderCatalog = async (providerId: string) => {
    setLoadingCatalog(true);
    const prods = await api.fetchProviderProducts(providerId, 100);
    setCatalog(prods);
    setLoadingCatalog(false);
  };

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (activeProviderId) {
      loadProviderCatalog(activeProviderId);
    }
  }, [activeProviderId]);

  const activeProvider = providers.find((p) => p.id === activeProviderId) || providers[0];

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    const res = await api.testProvider(id);
    if (res.success) {
      showToast(`Conexión exitosa. Saldo actualizado: $${(res.balanceUSD || 0).toFixed(2)} USD`);
      loadProviders();
    } else {
      showToast(`Error de conexión: ${res.error || 'No responde'}`);
    }
    setTestingId(null);
  };

  const handleOpenAdd = () => {
    setEditingProvider({
      id: `prov_${Date.now().toString().slice(-4)}`,
      name: '',
      type: 'custom',
      apiBaseUrl: 'https://',
      apiKey: '',
      authHeaderName: 'X-API-Key',
      pingEndpoint: 'health',
      balanceUSD: 0,
      status: 'active',
      autoFulfill: true,
      marginMultiplier: 3.0,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Provider) => {
    setEditingProvider(p);
    setIsModalOpen(true);
  };

  const handleDeleteProvider = async (id: string) => {
    if (id === 'bunaistore') {
      if (!window.confirm('¿Estás seguro de eliminar el proveedor principal BunaiStore?')) return;
    } else {
      if (!window.confirm('¿Estás seguro de eliminar este proveedor API?')) return;
    }

    const ok = await api.deleteProvider(id);
    if (ok) {
      showToast('Proveedor eliminado exitosamente');
      loadProviders();
    }
  };

  const handleSaveProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider || !editingProvider.name || !editingProvider.apiBaseUrl) {
      showToast('Por favor completa los campos obligatorios');
      return;
    }

    const payload: Partial<Provider> = {
      ...editingProvider,
      id: editingProvider.id || `prov_${Date.now()}`,
      marginMultiplier: Number(editingProvider.marginMultiplier) || 3.0,
      balanceUSD: Number(editingProvider.balanceUSD) || 0,
    };

    const ok = await api.saveProvider(payload);
    if (ok) {
      showToast(`Proveedor "${payload.name}" guardado exitosamente`);
      setIsModalOpen(false);
      setEditingProvider(null);
      loadProviders();
    } else {
      showToast('Error al guardar el proveedor');
    }
  };

  const isProductSynced = (item: any): boolean => {
    return products.some(
      (p) =>
        p.providerProductId === item.providerProductId ||
        p.bunaiProductId === item.providerProductId ||
        p.id === `bunai-${item.providerProductId}` ||
        p.id === `prov-${item.providerProductId}`
    );
  };

  const getRetailPricePEN = (item: any): number => {
    if (customPrices[item.providerProductId]) {
      return customPrices[item.providerProductId];
    }
    const costPEN = (item.wholesalePriceUSD || 0) * 3.75;
    const mult = activeProvider?.marginMultiplier || 3.0;
    const computed = Math.round(costPEN * mult);
    return Math.max(9.90, computed < 15 ? 14.90 : computed);
  };

  const handleSyncItem = async (item: any) => {
    setSyncingItemId(item.providerProductId);
    const retailPEN = getRetailPricePEN(item);
    const usdPrice = Math.round((retailPEN / 3.75) * 100) / 100;
    const origUsd = Math.round(usdPrice * 1.5 * 100) / 100;

    let cat: CategoryId = 'multimodal';
    const n = item.name.toLowerCase();
    if (n.includes('api') || n.includes('key') || n.includes('windows') || n.includes('vpn')) cat = 'dev';
    if (n.includes('office') || n.includes('duolingo') || n.includes('notion') || n.includes('linkedin')) cat = 'corporativo';

    const payload: Partial<Product> = {
      id: `${activeProvider?.id || 'prov'}-${item.providerProductId}`,
      providerId: activeProvider?.id || 'bunaistore',
      providerName: activeProvider?.name || 'Proveedor Verificado',
      providerProductId: item.providerProductId,
      bunaiProductId: item.providerProductId,
      bunaiStock: item.stock || 99,
      wholesalePriceUSD: item.wholesalePriceUSD || 0,
      name: item.name,
      subtitle: item.deliveryType === 'auto' ? 'Entrega Automática Inmediata' : 'Activación Garantizada',
      category: cat,
      badge: activeProvider?.name ? activeProvider.name.toUpperCase() : 'VERIFICADO',
      regionBadge: 'GLOBAL KEY',
      canActivateInCountry: true,
      discountPercent: 33,
      originalPriceDisplay: origUsd.toFixed(2),
      priceDisplay: usdPrice.toFixed(2),
      g2aPlusPriceDisplay: (usdPrice * 0.9).toFixed(2),
      yearlyPriceDisplay: usdPrice.toFixed(2),
      originalYearlyPriceDisplay: origUsd.toFixed(2),
      priceUnit: `USD / S/ ${retailPEN.toFixed(2)} PEN`,
      numericPrice: usdPrice,
      numericYearlyPrice: usdPrice,
      numericOriginalPrice: origUsd,
      sellerName: `${activeProvider?.name || 'ArnoAI'} Official`,
      sellerRating: 4.9,
      sellerFeedbackPercent: 99.8,
      sellerSales: 1650,
      shieldIncluded: true,
      headerBg: 'dark-purple',
      iconType: 'zap',
      description: item.note
        ? item.note.replace(/<[^>]+>/g, '').trim()
        : `Licencia oficial de ${item.name} provista mediante ${activeProvider?.name || 'API oficial'}.`,
      checklist: [
        'Licencia digital 100% oficial',
        'Entrega inmediata 24/7 garantizada',
        item.warrantyHours > 0 ? `Garantía oficial de ${Math.round(item.warrantyHours / 24)} días` : 'Garantía oficial de reposición',
        'Soporte técnico por WhatsApp'
      ],
      modelsIncluded: [item.name],
      specs: [
        { label: 'Proveedor API', value: activeProvider?.name || 'API Externa' },
        { label: 'Tipo de Entrega', value: item.deliveryType === 'auto' ? 'Instantánea (Auto)' : 'Manual asistida' },
        { label: 'Stock', value: `${item.stock} disponibles` },
        { label: 'Garantía', value: item.warrantyHours > 0 ? `${Math.round(item.warrantyHours / 24)} Días` : '24 Horas Reposición' }
      ],
      idealFor: `Usuarios y empresas que necesitan ${item.name} al mejor precio garantizado en Soles.`,
      activationKeySample: 'AUTO-DISPATCH-KEY',
      imageUrl: '',
      isActive: true,
    };

    const success = await api.syncProviderProduct(payload);
    if (success) {
      const refreshed = await api.fetchProducts();
      if (refreshed) {
        onUpdateProducts(refreshed);
      }
      showToast(`Producto "${payload.name}" sincronizado en la tienda`);
    } else {
      showToast('Error sincronizando producto');
    }
    setSyncingItemId(null);
  };

  const filteredCatalog = catalog.filter((it) => {
    const matchesSearch =
      it.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      String(it.providerProductId).toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesStock = onlyInStock ? (it.stock || 0) > 0 : true;
    return matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Top Providers Overview Header */}
      <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h2 className="text-lg font-black text-[var(--color-text)] flex items-center space-x-2">
              <Globe className="w-5 h-5 text-[#847CB8]" />
              <span>Gestión de Proveedores & APIs Multi-Tienda</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px]">
              {providers.filter((p) => p.status === 'active').length} Conectados
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Conecta, audita y gestiona múltiples APIs mayoristas (BunaiStore, G2A, Kinguin o REST personalizadas) para surtir automáticamente tu tienda.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-black text-xs transition cursor-pointer flex items-center space-x-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Conectar Nueva Tienda / API</span>
        </button>
      </div>

      {/* Providers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((p) => {
          const isActive = activeProviderId === p.id;
          const isTesting = testingId === p.id;

          return (
            <div
              key={p.id}
              onClick={() => setActiveProviderId(p.id)}
              className={`p-5 rounded-3xl bg-[var(--color-surface)] border transition cursor-pointer flex flex-col justify-between space-y-4 ${
                isActive
                  ? 'border-[#847CB8] ring-2 ring-[#847CB8]/30 shadow-md'
                  : 'border-[var(--color-border)] hover:border-white/20'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                        p.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {p.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/5 text-[var(--color-text-muted)] uppercase">
                        {p.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-[var(--color-text)] mt-1.5">{p.name}</h3>
                  </div>

                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white transition cursor-pointer"
                      title="Editar configuración"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(p.id)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition cursor-pointer"
                      title="Eliminar proveedor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* API Details Box */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[var(--color-text-muted)]">
                    <span>Saldo Mayorista:</span>
                    <span className="font-mono font-black text-emerald-400">
                      ${(p.balanceUSD || 0).toFixed(2)} USD (S/ {((p.balanceUSD || 0) * 3.75).toFixed(2)})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[var(--color-text-muted)]">
                    <span>Margen Base:</span>
                    <span className="font-bold text-[var(--color-text)]">{p.marginMultiplier || 3.0}x</span>
                  </div>

                  <div className="flex items-center justify-between text-[var(--color-text-muted)]">
                    <span>Auto Despacho:</span>
                    <span className={`font-bold ${p.autoFulfill ? 'text-blue-400' : 'text-[var(--color-text-muted)]'}`}>
                      {p.autoFulfill ? 'Automático' : 'Manual'}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-[var(--color-text-muted)] truncate pt-1 border-t border-white/5">
                    {p.apiBaseUrl}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center space-x-2 pt-2 border-t border-[var(--color-border)]" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleTestConnection(p.id)}
                  disabled={isTesting}
                  className="w-1/2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[var(--color-text)] transition cursor-pointer flex items-center justify-center space-x-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>Probar Conexión</span>
                </button>

                <button
                  onClick={() => setActiveProviderId(p.id)}
                  className={`w-1/2 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center space-x-1 ${
                    isActive
                      ? 'bg-[#847CB8] text-white shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-[var(--color-text)]'
                  }`}
                >
                  <span>Ver Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Provider Catalog Section */}
      {activeProvider && (
        <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
          <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[var(--color-text)] flex items-center space-x-2">
                <Store className="w-5 h-5 text-[#847CB8]" />
                <span>Catálogo en Vivo: {activeProvider.name}</span>
                <span className="text-xs text-[var(--color-text-muted)] font-normal">
                  ({filteredCatalog.length} productos disponibles)
                </span>
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Selecciona productos del proveedor para sincronizarlos en Soles en tu tienda con margen automático.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex items-center bg-white/5 border border-[var(--color-border)] rounded-2xl px-3 py-1.5 w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] mr-2 shrink-0" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Buscar en este proveedor..."
                  className="w-full bg-transparent text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none font-semibold"
                />
              </div>

              {/* Stock Toggle */}
              <button
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  onlyInStock
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-[var(--color-text-muted)] border border-transparent'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${onlyInStock ? 'opacity-100' : 'opacity-0'}`} />
                <span>Solo en Stock</span>
              </button>

              <button
                onClick={() => loadProviderCatalog(activeProvider.id)}
                disabled={loadingCatalog}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text)] transition cursor-pointer"
                title="Actualizar catálogo"
              >
                <RefreshCw className={`w-4 h-4 ${loadingCatalog ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadingCatalog ? (
              <div className="col-span-full py-12 text-center text-xs text-[var(--color-text-muted)] font-bold">
                Cargando catálogo en tiempo real desde la API del proveedor...
              </div>
            ) : filteredCatalog.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs text-[var(--color-text-muted)] font-medium">
                No hay productos disponibles en este proveedor con los filtros seleccionados.
              </div>
            ) : (
              filteredCatalog.map((item) => {
                const isSynced = isProductSynced(item);
                const retailPEN = getRetailPricePEN(item);
                const costPEN = (item.wholesalePriceUSD || 0) * 3.75;
                const profitPEN = Math.max(0, retailPEN - costPEN);
                const marginPercent = Math.round((profitPEN / (costPEN || 0.1)) * 100);
                const isSyncing = syncingItemId === item.providerProductId;

                return (
                  <div
                    key={item.providerProductId}
                    className={`p-5 rounded-3xl bg-[var(--color-surface)] border transition flex flex-col justify-between space-y-4 ${
                      isSynced
                        ? 'border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-[var(--color-border)] hover:border-[#847CB8]/50'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                              item.deliveryType === 'auto'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-purple-500/20 text-purple-400'
                            }`}>
                              {item.deliveryType === 'auto' ? 'Auto Entrega' : 'Manual'}
                            </span>
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-400">
                              {item.stock} en stock
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-[var(--color-text)] line-clamp-2 leading-snug">
                            {item.name}
                          </h4>
                        </div>

                        {isSynced && (
                          <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0" title="Actualmente en Tienda">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      {/* Cost breakdown */}
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[var(--color-text-muted)] font-semibold">
                          <span>Costo Mayorista API:</span>
                          <span className="font-mono font-bold text-[var(--color-text)]">
                            ${(item.wholesalePriceUSD || 0).toFixed(2)} USD (S/ {costPEN.toFixed(2)})
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-[var(--color-text-muted)]">Margen Neto:</span>
                          <span className="font-mono font-bold text-emerald-500">
                            +{marginPercent}% (+S/ {profitPEN.toFixed(2)} PEN)
                          </span>
                        </div>
                      </div>

                      {/* Selling Price input */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-[var(--color-text-muted)] flex items-center justify-between">
                          <span>Precio Venta (Soles):</span>
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
                              setCustomPrices((prev) => ({ ...prev, [item.providerProductId]: val }));
                            }}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs font-extrabold text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sync button */}
                    <button
                      onClick={() => handleSyncItem(item)}
                      disabled={isSyncing}
                      className={`w-full py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm ${
                        isSynced
                          ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#847CB8] hover:bg-[#6F66A8] text-white'
                      }`}
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Guardando...</span>
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
              })
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Provider Modal */}
      {isModalOpen && editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-[var(--color-text)] flex items-center space-x-2">
              <Globe className="w-5 h-5 text-[#847CB8]" />
              <span>{editingProvider.id ? 'Configurar Proveedor API' : 'Conectar Nueva API'}</span>
            </h3>

            <p className="text-xs text-[var(--color-text-muted)]">
              Ingresa los datos de acceso para sincronizar productos y automatizar el despacho de licencias.
            </p>

            <form onSubmit={handleSaveProvider} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--color-text-muted)]">Identificador (ID):</label>
                  <input
                    type="text"
                    required
                    value={editingProvider.id || ''}
                    onChange={(e) => setEditingProvider({ ...editingProvider, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs font-mono font-bold text-[var(--color-text)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--color-text-muted)]">Nombre de la Tienda / API:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. BunaiStore, G2A, Kinguin"
                    value={editingProvider.name || ''}
                    onChange={(e) => setEditingProvider({ ...editingProvider, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--color-text-muted)]">Tipo de Conector:</label>
                <select
                  value={editingProvider.type || 'custom'}
                  onChange={(e) => setEditingProvider({ ...editingProvider, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)]"
                >
                  <option value="bunaistore">BunaiStore API</option>
                  <option value="g2a">G2A Business API</option>
                  <option value="kinguin">Kinguin Reseller API</option>
                  <option value="custom">API REST Genérica (Custom Webhook)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--color-text-muted)]">URL Base de la API:</label>
                <input
                  type="text"
                  required
                  placeholder="https://api.tuproveedor.com/v1"
                  value={editingProvider.apiBaseUrl || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, apiBaseUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs font-mono font-bold text-[var(--color-text)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--color-text-muted)]">Clave API / Token:</label>
                  <input
                    type="password"
                    placeholder="Shop::... o Bearer Token"
                    value={editingProvider.apiKey || ''}
                    onChange={(e) => setEditingProvider({ ...editingProvider, apiKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs font-mono font-bold text-[var(--color-text)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--color-text-muted)]">Cabecera de Auth:</label>
                  <input
                    type="text"
                    placeholder="X-API-Key o Authorization"
                    value={editingProvider.authHeaderName || 'X-API-Key'}
                    onChange={(e) => setEditingProvider({ ...editingProvider, authHeaderName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[var(--color-text-muted)]">Multiplicador Margen:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingProvider.marginMultiplier || 3.0}
                    onChange={(e) => setEditingProvider({ ...editingProvider, marginMultiplier: parseFloat(e.target.value) || 3.0 })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)]"
                  />
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <label className="flex items-center space-x-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProvider.autoFulfill)}
                      onChange={(e) => setEditingProvider({ ...editingProvider, autoFulfill: e.target.checked })}
                      className="rounded text-[#847CB8]"
                    />
                    <span className="text-xs font-bold text-[var(--color-text)]">Auto-Despacho en Compras</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--color-text-muted)]">Notas / Comentarios:</label>
                <textarea
                  rows={2}
                  placeholder="Información sobre este proveedor o instrucciones especiales"
                  value={editingProvider.notes || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs text-[var(--color-text)]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProvider(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[var(--color-text-muted)] transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white text-xs font-black transition cursor-pointer shadow-md"
                >
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
