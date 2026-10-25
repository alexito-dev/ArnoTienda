import React, { useState, useEffect } from 'react';
import { Product, CategoryId, StoreMetrics } from '../../types/store';
import { CATEGORIES } from '../../data/products';
import { ProductFormModal } from './ProductFormModal';
import { MultiProviderTab } from './MultiProviderTab';
import { OrdersAdminTab } from './OrdersAdminTab';
import { api } from '../../services/api';
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  DollarSign,
  Image as ImageIcon,
  RotateCcw,
  Search,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  TrendingUp,
  Database,
  Settings,
  Zap,
  Globe,
  CreditCard,
  BarChart3,
  Clock,
  ArrowRight,
  Wallet,
  Building2,
  ShieldCheck,
  Percent
} from 'lucide-react';

interface Props {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onResetDefault: () => void;
  onCloseAdmin: () => void;
}

export const AdminPanel: React.FC<Props> = ({
  products,
  onUpdateProducts,
  onResetDefault,
  onCloseAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'providers' | 'orders' | 'discounts' | 'prices' | 'images'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string>('todos');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<StoreMetrics | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadMetrics = async () => {
    const data = await api.fetchStoreMetrics();
    if (data) setMetrics(data);
  };

  useEffect(() => {
    loadMetrics();
  }, [products]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto de la base de datos SQLite?')) {
      await api.deleteProduct(productId);
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
      showToast('Producto eliminado de la Base de Datos SQLite');
    }
  };

  const handleSaveProduct = async (savedProduct: Product) => {
    const success = await api.saveProduct(savedProduct);

    const existingIdx = products.findIndex((p) => p.id === savedProduct.id);
    let updated: Product[];

    if (existingIdx !== -1) {
      updated = [...products];
      updated[existingIdx] = savedProduct;
      showToast(success ? `Producto "${savedProduct.name}" guardado en la BD SQLite` : `Producto "${savedProduct.name}" actualizado`);
    } else {
      updated = [savedProduct, ...products];
      showToast(success ? `Nuevo producto "${savedProduct.name}" guardado en la BD SQLite` : `Nuevo producto "${savedProduct.name}" creado`);
    }

    onUpdateProducts(updated);
  };

  const handleQuickPriceChange = async (productId: string, newPrice: number) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const penVal = Math.round(newPrice * 3.75 * 10) / 10;
    const updatedProduct: Product = {
      ...targetProduct,
      numericPrice: newPrice,
      numericYearlyPrice: newPrice,
      priceDisplay: newPrice.toFixed(2),
      yearlyPriceDisplay: newPrice.toFixed(2),
      priceUnit: `USD / S/ ${penVal.toFixed(2)} PEN`,
    };

    await api.saveProduct(updatedProduct);

    const updatedList = products.map((p) => (p.id === productId ? updatedProduct : p));
    onUpdateProducts(updatedList);
    showToast('Precio actualizado en la BD SQLite');
  };

  const handleQuickDiscountChange = async (productId: string, discount: number) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const updatedProduct: Product = {
      ...targetProduct,
      discountPercent: discount,
    };

    await api.saveProduct(updatedProduct);

    const updatedList = products.map((p) => (p.id === productId ? updatedProduct : p));
    onUpdateProducts(updatedList);
    showToast('Oferta actualizada en la BD SQLite');
  };

  // Filter products by category, search and provider
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const prov = p.providerId || (p.bunaiProductId ? 'bunaistore' : 'local');
    const matchesProvider = selectedProviderFilter === 'todos' || prov === selectedProviderFilter;
    return matchesCat && matchesSearch && matchesProvider;
  });

  const totalSalesEstimate = products.reduce((acc, p) => acc + p.sellerSales, 0);

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#121214] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 text-xs font-bold border border-white/15 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCloseAdmin}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[var(--color-text)] transition cursor-pointer flex items-center space-x-1 text-xs font-extrabold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Tienda</span>
          </button>

          <div>
            <h1 className="text-xl font-black text-[var(--color-text)] flex items-center space-x-2">
              <Settings className="w-5 h-5 text-[#847CB8]" />
              <span>Panel de Control & Multi-Proveedor ArnoTienda</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center space-x-1">
                <Database className="w-3 h-3" />
                <span>SQLite DB Conectada</span>
              </span>
            </h1>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Gestión centralizada de catálogo, APIs mayoristas, ventas en Soles y despacho de licencias.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={onResetDefault}
            className="px-4 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-extrabold text-xs transition cursor-pointer flex items-center space-x-1.5 border border-red-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer BD</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-2xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-extrabold text-xs transition cursor-pointer flex items-center space-x-2 shadow-md"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>+ Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-[var(--color-border)] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-[#847CB8] text-white shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Finanzas & Métricas</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeTab === 'products'
              ? 'bg-[#847CB8] text-white shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Catálogo & Inventario ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeTab === 'providers'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>APIs & Multi-Tiendas</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Ventas & Despacho</span>
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeTab === 'prices'
              ? 'bg-[#52B747] text-white shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Precios & Soles (PEN)</span>
        </button>

        <button
          onClick={() => setActiveTab('discounts')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeTab === 'discounts'
              ? 'bg-[#FF66C4] text-white shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Ofertas & Rebajas</span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeTab === 'images'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Portadas</span>
        </button>
      </div>

      {/* Tab 0: Real-time Dashboard & Financial Metrics */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--color-text-muted)] font-semibold">Total Ventas (Soles)</span>
                <div className="text-2xl font-black text-emerald-500 mt-1">
                  S/ {metrics ? metrics.totalSalesPEN.toFixed(2) : '0.00'} PEN
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] font-bold">
                  {metrics ? metrics.totalOrders : 0} pedidos confirmados
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-500">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--color-text-muted)] font-semibold">Ganancia Neta Estimada</span>
                <div className="text-2xl font-black text-blue-400 mt-1">
                  S/ {metrics ? metrics.netProfitPEN.toFixed(2) : '0.00'} PEN
                </div>
                <span className="text-[10px] text-blue-400 font-extrabold">
                  Margen Neto: +{metrics ? metrics.marginPercent : 0}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--color-text-muted)] font-semibold">Costo Mayorista Total</span>
                <div className="text-2xl font-black text-amber-400 mt-1">
                  S/ {metrics ? metrics.estimatedCostPEN.toFixed(2) : '0.00'} PEN
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] font-bold">
                  Equiv: ${metrics ? (metrics.estimatedCostPEN / 3.75).toFixed(2) : '0.00'} USD
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400">
                <Percent className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--color-text-muted)] font-semibold">APIs de Proveedores</span>
                <div className="text-2xl font-black text-[#847CB8] mt-1">
                  {metrics ? metrics.activeProvidersCount : 0} Activas
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] font-bold">
                  de {metrics ? metrics.totalProvidersCount : 0} configuradas
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#847CB8]/15 text-[#847CB8]">
                <Globe className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Connected Providers Status Overview */}
          <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[var(--color-text)] flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#847CB8]" />
                  <span>Estado de Saldo en Proveedores Mayoristas</span>
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Balance disponible en tus cuentas mayoristas para la compra y auto-despacho de licencias.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('providers')}
                className="text-xs font-black text-[#847CB8] hover:underline flex items-center space-x-1"
              >
                <span>Administrar Proveedores</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(metrics?.providers || []).map((prov) => (
                <div
                  key={prov.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[var(--color-text)] truncate">{prov.name}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                      prov.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {prov.status}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Saldo Disponible:</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      ${prov.balanceUSD.toFixed(2)} USD
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)] ml-1 font-semibold">
                      (S/ {(prov.balanceUSD * 3.75).toFixed(2)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('providers')}
              className="p-6 rounded-3xl bg-gradient-to-br from-[#847CB8]/20 to-purple-600/10 border border-[#847CB8]/30 hover:border-[#847CB8] transition cursor-pointer space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center font-bold shadow-md">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-[var(--color-text)]">Conectar & Gestionar APIs</h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                Agrega nuevas APIs de tiendas digitales mayoristas, prueba conexión y sincroniza productos directamente.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('orders')}
              className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/30 hover:border-blue-400 transition cursor-pointer space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-[var(--color-text)]">Ventas & Despacho</h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                Revisa pedidos de clientes, asigna claves manuales o reintenta el despacho con el proveedor en 1 clic.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('products')}
              className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/30 hover:border-emerald-400 transition cursor-pointer space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-[var(--color-text)]">Inventario & Catálogo</h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                Controla todos los productos de la tienda, ajusta precios en Soles y filtra por proveedor de origen.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Products Table */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="w-full md:w-80 flex items-center bg-white/5 border border-[var(--color-border)] rounded-2xl px-3.5 py-2">
              <Search className="w-4 h-4 text-[var(--color-text-muted)] mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o licencia..."
                className="w-full bg-transparent text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none font-semibold"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-[var(--color-text-muted)] font-semibold shrink-0">Categoría:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryId)}
                  className="px-3 py-2 rounded-xl text-xs font-extrabold text-[var(--color-text)] bg-white/5 border border-[var(--color-border)] focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#121214] text-white">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-[var(--color-text-muted)] font-semibold shrink-0">Proveedor:</span>
                <select
                  value={selectedProviderFilter}
                  onChange={(e) => setSelectedProviderFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-extrabold text-[var(--color-text)] bg-white/5 border border-[var(--color-border)] focus:outline-none cursor-pointer"
                >
                  <option value="todos" className="bg-[#121214] text-white">Todos los Proveedores</option>
                  <option value="bunaistore" className="bg-[#121214] text-white">BunaiStore API</option>
                  <option value="g2a" className="bg-[#121214] text-white">G2A Direct</option>
                  <option value="local" className="bg-[#121214] text-white">Stock Propio / Local</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-[var(--color-border)] text-[var(--color-text-muted)] font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Producto</th>
                    <th className="py-3.5 px-4">Proveedor / API</th>
                    <th className="py-3.5 px-4">Categoría</th>
                    <th className="py-3.5 px-4">Precio Venta (S/)</th>
                    <th className="py-3.5 px-4">Costo Mayorista ($)</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/40 font-semibold">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[var(--color-text-muted)]">
                        No se encontraron productos con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4 flex items-center space-x-3">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt="" className="w-10 h-12 object-cover rounded-lg border border-white/10 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-[#847CB8]/20 flex items-center justify-center text-[#847CB8] font-bold text-xs shrink-0">
                              A
                            </div>
                          )}
                          <div>
                            <span className="font-extrabold text-[var(--color-text)] block">{product.name}</span>
                            <span className="text-[10px] text-[var(--color-text-muted)]">{product.subtitle || 'Licencia Digital'}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-400 font-bold text-[10px] uppercase">
                            {product.providerName || (product.bunaiProductId ? 'BunaiStore API' : 'ArnoAI Direct')}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[var(--color-text)] text-[10px] font-bold uppercase">
                            {product.category}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-black text-emerald-500 text-sm">
                          S/ {(product.numericPrice * 3.75).toFixed(2)} PEN
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-[var(--color-text-muted)]">
                          ${(product.wholesalePriceUSD || product.numericPrice).toFixed(2)} USD
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                            (product.bunaiStock ?? 99) > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {(product.bunaiStock ?? 99) > 0 ? `${product.bunaiStock ?? 99} disp.` : 'Agotado'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-2 rounded-xl bg-white/10 hover:bg-[#847CB8] hover:text-white text-[var(--color-text)] transition cursor-pointer"
                            title="Editar producto"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white text-[var(--color-text)] transition cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Multi-Provider & APIs Hub */}
      {activeTab === 'providers' && (
        <MultiProviderTab
          products={products}
          onUpdateProducts={onUpdateProducts}
          showToast={showToast}
        />
      )}

      {/* Tab 3: Orders & Dispatch Management */}
      {activeTab === 'orders' && (
        <OrdersAdminTab showToast={showToast} />
      )}

      {/* Tab 4: Offers & Discounts */}
      {activeTab === 'discounts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-[#FF66C4]/15 text-[#FF66C4]">
                  <Tag className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="font-extrabold text-xs text-[var(--color-text)] block truncate">{product.name}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)] font-mono">${product.numericPrice.toFixed(2)} USD</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--color-text-muted)] block">Porcentaje de Rebaja (%):</label>
                <div className="flex items-center space-x-2">
                  {[0, 15, 25, 35, 50].map((disc) => (
                    <button
                      key={disc}
                      onClick={() => handleQuickDiscountChange(product.id, disc)}
                      className={`px-2.5 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                        (product.discountPercent || 0) === disc
                          ? 'bg-[#FF66C4] text-white shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)]'
                      }`}
                    >
                      {disc === 0 ? 'Normal' : `-${disc}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Prices & Currency */}
      {activeTab === 'prices' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-5 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-3"
            >
              <span className="font-extrabold text-xs text-[var(--color-text)] block truncate">{product.name}</span>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--color-text-muted)] block">Precio en USD:</label>
                <input
                  type="number"
                  step="0.01"
                  value={product.numericPrice}
                  onChange={(e) => handleQuickPriceChange(product.id, parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] focus:outline-none focus:border-[#847CB8]"
                />
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Equivalente en Soles: S/ {(product.numericPrice * 3.75).toFixed(2)} PEN
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Images Gallery */}
      {activeTab === 'images' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in duration-200">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-2 text-center group cursor-pointer"
              onClick={() => handleOpenEdit(product)}
            >
              <div className="h-44 rounded-xl bg-black/20 relative overflow-hidden flex items-center justify-center border border-white/10">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <span className="text-xs text-[var(--color-text-muted)] font-bold">Sin Imagen</span>
                )}
              </div>
              <span className="text-xs font-black text-[var(--color-text)] block truncate">{product.name}</span>
              <button className="text-[10px] font-extrabold text-[#847CB8] hover:underline">
                Cambiar Portada
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaveProduct={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </div>
  );
};
