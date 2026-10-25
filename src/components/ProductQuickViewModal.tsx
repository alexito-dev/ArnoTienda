import { X, Sparkles, Check, Cpu, Zap, ArrowRight, Star, Target } from 'lucide-react';
import { Product } from '../types/store';

interface Props {
  product: Product | null;
  billingCycle: 'monthly' | 'yearly';
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onContact: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<Props> = ({
  product,
  billingCycle,
  onClose,
  onAddToCart,
  onContact,
}) => {
  if (!product) return null;

  const currentPrice = billingCycle === 'yearly' ? product.yearlyPriceDisplay : product.priceDisplay;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Top Header - Solid Color Fill (NO Gradients) */}
        <div className="p-6 bg-[#1E1C21] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#847CB8] text-white">
              Ficha Técnica Oficial
            </span>
            <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.sellerRating} / 5.0</span>
              <span className="text-zinc-400 font-normal">({product.sellerSales} ventas)</span>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">{product.name}</h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-lg">{product.description}</p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Models Included */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[#847CB8]" />
              <span>Modelos de Inteligencia Artificial Incluidos</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.modelsIncluded.map((model, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-[#847CB8]/15 text-[#847CB8] dark:text-[#9A90D0] text-xs font-bold border border-[#847CB8]/30 flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#FF66C4]" />
                  <span>{model}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#847CB8]" />
              <span>Especificaciones de la Licencia Digital</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.specs.map((spec, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-0.5">
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block">
                    {spec.label}
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text)]">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ideal For */}
          <div className="p-4 rounded-2xl bg-[#847CB8]/10 border border-[#847CB8]/20 text-xs">
            <span className="font-bold text-[#847CB8] mb-1 flex items-center space-x-1">
              <Target className="w-3.5 h-3.5" />
              <span>Ideal para:</span>
            </span>
            <p className="text-[var(--color-text-muted)] leading-relaxed">{product.idealFor}</p>
          </div>
        </div>

        {/* Modal Footer Action */}
        <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase block">Precio Oferta</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#847CB8]">
                {currentPrice}
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-semibold">
                {product.priceUnit}
              </span>
            </div>
          </div>

          {product.isContactOnly ? (
            <button
              onClick={() => {
                onContact(product);
                onClose();
              }}
              className="py-3 px-6 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              Contactar Ventas Corporativas
            </button>
          ) : (
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="py-3 px-6 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center space-x-2"
            >
              <span>Agregar al carrito</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
