import React, { useState } from 'react';
import { Sparkles, X, Check, ArrowRight, Bot, Code, Eye, Shield, Cpu } from 'lucide-react';
import { Product } from '../types/store';
import { PRODUCTS } from '../data/products';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const AIPlanWizard: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectGoal = (selectedGoal: string) => {
    setGoal(selectedGoal);
    setStep(2);
  };

  const getRecommendedProduct = (): Product => {
    if (goal === 'coding') return PRODUCTS.find((p) => p.id === 'arnoai-copilot') || PRODUCTS[0];
    if (goal === 'vision') return PRODUCTS.find((p) => p.id === 'arnoai-vision') || PRODUCTS[1];
    if (goal === 'all') return PRODUCTS.find((p) => p.id === 'arnoai-pro') || PRODUCTS[2];
    if (goal === 'api') return PRODUCTS.find((p) => p.id === 'api-access') || PRODUCTS[3];
    if (goal === 'team') return PRODUCTS.find((p) => p.id === 'arnoai-teams') || PRODUCTS[4];
    return PRODUCTS[2];
  };

  const recommended = getRecommendedProduct();

  const handleReset = () => {
    setStep(1);
    setGoal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden z-10">
        {/* Header - Solid Charcoal #1E1C21 (NO Gradients) */}
        <div className="p-6 bg-[#1E1C21] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#847CB8] text-white flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Asistente IA de Selección</h3>
              <p className="text-xs text-zinc-300">Encuentra el plan ideal para tu flujo en 30 segundos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Content */}
        {step === 1 ? (
          <div className="p-6 space-y-4">
            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider block">
              Paso 1 de 2: ¿Cuál es tu objetivo principal?
            </span>

            <div className="space-y-2.5">
              <button
                onClick={() => handleSelectGoal('coding')}
                className="w-full p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[#847CB8]/10 hover:border-[#847CB8] transition text-left flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Code className="w-5 h-5 text-[#847CB8]" />
                  <div>
                    <span className="text-xs font-bold text-[var(--color-text)] block">Autocompletado de código en VS Code / JetBrains</span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">Programación ágil y sugerencias en tiempo real</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleSelectGoal('vision')}
                className="w-full p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[#FF66C4]/10 hover:border-[#FF66C4] transition text-left flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-[#FF66C4]" />
                  <div>
                    <span className="text-xs font-bold text-[var(--color-text)] block">Análisis de imágenes, OCR & Generación visual</span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">Procesamiento de documentos y diseño asistido</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleSelectGoal('all')}
                className="w-full p-3.5 rounded-2xl border border-[#847CB8]/40 bg-[#847CB8]/10 hover:bg-[#847CB8]/20 transition text-left flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-[#847CB8]" />
                  <div>
                    <span className="text-xs font-extrabold text-[var(--color-text)] block">Suite Completa (Código + Visión + Razonamiento)</span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">Claude 4.6, Opus 5 y GPT-4o en un solo plan</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleSelectGoal('api')}
                className="w-full p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-slate-500/10 hover:border-slate-500 transition text-left flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Cpu className="w-5 h-5 text-slate-500" />
                  <div>
                    <span className="text-xs font-bold text-[var(--color-text)] block">Acceso directo a API para Desarrolladores</span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">Integración HTTP sin mínimos y pago por uso</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleSelectGoal('team')}
                className="w-full p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[#847CB8]/10 hover:border-[#847CB8] transition text-left flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-[#847CB8]" />
                  <div>
                    <span className="text-xs font-bold text-[var(--color-text)] block">Plan para Equipos de Trabajo (hasta 25 personas)</span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">Panel de administración, SSO y facturación unificada</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <span className="text-xs font-bold text-[#847CB8] uppercase tracking-wider block">
              ✓ Recomendación Personalizada
            </span>

            <div className="p-5 rounded-3xl bg-[var(--color-bg)] border border-[#847CB8]/30 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#847CB8]/20 text-[#847CB8]">
                    {recommended.badge || 'Recomendado'}
                  </span>
                  <h4 className="text-xl font-extrabold text-[var(--color-text)] mt-1">{recommended.name}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#847CB8]">{recommended.priceDisplay}</span>
                  <span className="text-xs text-[var(--color-text-muted)] font-semibold block">{recommended.priceUnit}</span>
                </div>
              </div>

              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{recommended.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-[var(--color-border)]">
                {recommended.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-[var(--color-text-muted)]">
                    <Check className="w-3.5 h-3.5 text-[#A7D792] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="py-3 px-4 rounded-xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition cursor-pointer"
              >
                Reintentar
              </button>
              <button
                onClick={() => {
                  onSelectProduct(recommended);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#847CB8] hover:bg-[#6F66A8] text-white font-extrabold text-xs transition cursor-pointer shadow-xs flex items-center justify-center space-x-2"
              >
                <span>Añadir {recommended.name} al carrito</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
