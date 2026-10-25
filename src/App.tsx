import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { G2AHeroBanner } from './components/G2AHeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { DigitalKeyVault } from './components/DigitalKeyVault';
import { WhatsAppSupportWidget } from './components/WhatsAppSupportWidget';
import { AIPlanWizard } from './components/AIPlanWizard';
import { AdminPanel } from './components/admin/AdminPanel';
import { ThemeToggleFloating } from './components/ThemeToggleFloating';
import { SimpleAuthModal } from './components/SimpleAuthModal';
import { WalletModal } from './components/WalletModal';
import { OrdersHistoryModal } from './components/OrdersHistoryModal';
import {
  CATEGORIES,
  getStoredProducts,
  saveProductsToStorage,
  resetProductsToDefault
} from './data/products';
import { api } from './services/api';
import { getWalletBalance } from './services/walletService';
import { CategoryId, Product, CartItem, SortOption } from './types/store';
import { ShoppingBag, ShieldCheck, Zap, Lock, Headphones, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('arno_theme') as 'dark' | 'light') || 'light';
  });

  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('arno_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => getWalletBalance());
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>(() => getStoredProducts());

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [selectedSort, setSelectedSort] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('arno_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIWizardOpen, setIsAIWizardOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [contactProduct, setContactProduct] = useState<Product | null>(null);
  const [checkoutAmounts, setCheckoutAmounts] = useState({ subtotal: 0, discount: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark class on html tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('arno_theme', theme);
  }, [theme]);

  // Sync wallet balance
  useEffect(() => {
    const handleWalletUpdate = () => {
      setWalletBalance(getWalletBalance());
    };
    window.addEventListener('arno_wallet_updated', handleWalletUpdate);
    return () => window.removeEventListener('arno_wallet_updated', handleWalletUpdate);
  }, []);

  // Load products from SQLite Database on mount
  useEffect(() => {
    const loadFromDb = async () => {
      const dbProducts = await api.fetchProducts();
      if (dbProducts && dbProducts.length > 0) {
        setProductsList(dbProducts);
        saveProductsToStorage(dbProducts);
      }
    };
    loadFromDb();
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('arno_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleUpdateProducts = async (updatedProducts: Product[]) => {
    setProductsList(updatedProducts);
    saveProductsToStorage(updatedProducts);
  };

  const handleResetDefaultProducts = async () => {
    if (window.confirm('¿Deseas restablecer el catálogo y la base de datos al estado original?')) {
      await api.resetDatabase();
      const defaults = resetProductsToDefault();
      setProductsList(defaults);
      setToastMessage('Catálogo restablecido por defecto');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, billingCycle }];
    });

    setToastMessage(`"${product.name}" añadido al carrito`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = (subtotal: number, discount: number) => {
    setCheckoutAmounts({ subtotal, discount });
    setContactProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    setContactProduct(product);
    setCheckoutAmounts({ subtotal: product.numericPrice, discount: 0 });
    setIsCheckoutOpen(true);
  };

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProductForDetail(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccessOrder = () => {
    setIsCheckoutOpen(false);
    setIsKeyModalOpen(true);
  };

  // Filter & sort products
  const processedProducts = productsList
    .filter((p) => {
      if (p.isActive === false) return false;
      const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.modelsIncluded.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (selectedSort === 'price-asc') return a.numericPrice - b.numericPrice;
      if (selectedSort === 'price-desc') return b.numericPrice - a.numericPrice;
      if (selectedSort === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      if (selectedSort === 'rating') return b.sellerRating - a.sellerRating;
      if (selectedSort === 'bestsellers') return b.sellerSales - a.sellerSales;
      return 0; // featured default
    });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#121214] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 text-xs font-bold border border-white/15 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header Bar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAIWizard={() => setIsAIWizardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        walletBalance={walletBalance}
        user={userProfile}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedProductForDetail(null);
          setIsAdminOpen(false);
        }}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        {isAdminOpen ? (
          /* Admin Panel Workspace */
          <AdminPanel
            products={productsList}
            onUpdateProducts={handleUpdateProducts}
            onResetDefault={handleResetDefaultProducts}
            onCloseAdmin={() => setIsAdminOpen(false)}
          />
        ) : selectedProductForDetail ? (
          /* Detailed Product View */
          <ProductDetailPage
            product={selectedProductForDetail}
            onBack={() => setSelectedProductForDetail(null)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : (
          /* Clean & Spacious Catalog Homepage */
          <>
            {/* Single Elegant Spotlight Hero Banner */}
            <G2AHeroBanner
              billingCycle={billingCycle}
              onToggleBillingCycle={(cycle) => setBillingCycle(cycle)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleOpenProductDetail}
              onQuickView={setQuickViewProduct}
            />

            {/* Filter Pills Bar & Sorting */}
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSort={selectedSort}
              onSelectSort={setSelectedSort}
              totalProductsCount={processedProducts.length}
            />

            {/* Slim 5-6 Column Product Grid */}
            {processedProducts.length === 0 ? (
              <div className="text-center py-16 p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <ShoppingBag className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3 stroke-1" />
                <h3 className="text-base font-extrabold text-[var(--color-text)]">
                  No se encontraron licencias digitales
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Prueba cambiando la búsqueda o seleccionando otra categoría.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {processedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    billingCycle={billingCycle}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleOpenProductDetail}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Trust & Guarantee Strip */}
      <section className="border-t border-[var(--color-border)]/40 bg-[var(--color-surface)] py-8 px-4 md:px-8 mt-12 select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-[#847CB8]/15 text-[#847CB8] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[var(--color-text)]">Entrega Instantánea</h4>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-snug">
                Activación digital en menos de 60 segundos tras confirmar el pago.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[var(--color-text)]">Garantía Protegida 100%</h4>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-snug">
                Reposición garantizada y soporte continuo durante toda la suscripción.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-[#FF66C4]/15 text-[#FF66C4] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[var(--color-text)]">Pagos Seguros en Soles</h4>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-snug">
                Paga con Yape, Plin, Tarjetas o con Saldo de tu Arno Wallet.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-500 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[var(--color-text)]">Atención Humana 24/7</h4>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-snug">
                Asistencia directa por WhatsApp para resolver cualquier consulta al instante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)]/40 py-6 px-4 md:px-8 text-center text-xs text-[var(--color-text-muted)] select-none bg-[var(--color-sidebar)]">
        <p className="font-bold text-[var(--color-text)] mb-1">ArnoTienda • Licencias & Suscripciones Digitales</p>
        <p>© 2026 ArnoAI Services. Todos los derechos reservados.</p>
      </footer>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout / Contact Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        singleProduct={contactProduct}
        subtotal={checkoutAmounts.subtotal}
        discount={checkoutAmounts.discount}
        onSuccessOrder={handleSuccessOrder}
        onOpenWalletRecharge={() => setIsWalletOpen(true)}
      />

      {/* Instant Digital Key Reveal Vault Modal */}
      <DigitalKeyVault
        isOpen={isKeyModalOpen}
        onClose={() => {
          setIsKeyModalOpen(false);
          setCartItems([]);
        }}
        cartItems={cartItems}
      />

      {/* Product Quick View Specs Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        billingCycle={billingCycle}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onContact={(p) => {
          setContactProduct(p);
          setIsCheckoutOpen(true);
        }}
      />

      {/* AI Plan Wizard Modal */}
      <AIPlanWizard
        isOpen={isAIWizardOpen}
        onClose={() => setIsAIWizardOpen(false)}
        onSelectProduct={(p) => {
          handleAddToCart(p);
          setIsCartOpen(true);
        }}
      />

      {/* Floating WhatsApp Customer Support Widget */}
      <WhatsAppSupportWidget />

      {/* Simple Auth Modal */}
      <SimpleAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={(u) => setUserProfile(u)}
      />

      {/* Arno Wallet Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        onBalanceUpdated={(b) => setWalletBalance(b)}
      />

      {/* Orders & Licenses History Modal */}
      <OrdersHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      {/* Floating Theme Switcher Button */}
      <ThemeToggleFloating theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
};

export default App;
